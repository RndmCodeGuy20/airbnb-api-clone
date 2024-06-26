import { logger, pgsqlQuery } from '#helpers/index';
import { ERROR_CODES } from '#constants/error-codes.constant';
import { UserApiError } from './error';
import { StatusCodes } from 'http-status-codes';
import {
  compareHash,
  generateHash,
  generateRefreshToken,
  generateToken,
  generateVerificationToken,
  mailer,
  verifyRefreshToken,
} from '#utils/index';
import { envConfig } from '#configs/env.config';
import { ENVIRONMENTS } from '#constants/environments.constant';

/**
 * @class UserService
 * @description Service layer for user-related operations
 */
class UserService {
  /**
	 *
	 * @param {{
	 *   email: string,
	 *   password: string,
	 *   role: string
	 * }} body
	 * @return {Promise<{message: string}>}
	 */
  async register(body) {
    try {
      const userAlreadyExistsQuery = `SELECT *
																			FROM core_users
																			WHERE email = $1`;

      const userAlreadyExistsResult = await pgsqlQuery(userAlreadyExistsQuery, [
        body.email,
      ]);

      if (userAlreadyExistsResult.rows.length > 0) {
        throw new UserApiError(
            'USER_ALREADY_EXISTS',
            'User already exists',
            StatusCodes.CONFLICT,
            ERROR_CODES.DUPLICATE,
        );
      }

      const getUserRoleQuery = `SELECT *
																FROM core_roles
																WHERE role_name = $1`;

      const getUserRoleResult = await pgsqlQuery(getUserRoleQuery, [body.role]);

      const roleId = getUserRoleResult.rows[0].role_id;

      const hashedPassword = await generateHash(body.password);

      const insertUserQuery = `INSERT INTO core_users (email, password, role_id)
															 VALUES ($1, $2, $3) RETURNING user_id`;

      const insertUserResult = await pgsqlQuery(insertUserQuery, [
        body.email,
        hashedPassword,
        roleId,
      ]);

      if (!insertUserResult.rows) {
        throw new UserApiError(
            'REGISTRATION_FAILED',
            'User registration failed',
            StatusCodes.INTERNAL_SERVER_ERROR,
            ERROR_CODES.UNKNOWN_ERROR,
        );
      }

      const verificationToken = generateVerificationToken();

      const insertVerificationTokenQuery = `INSERT INTO data_captcha_tokens (user_id, token)
																						VALUES ($1, $2)`;

      const insertVerificationTokenResponse = await pgsqlQuery(
          insertVerificationTokenQuery,
          [insertUserResult.rows[0].user_id, verificationToken],
      );

      if (!insertVerificationTokenResponse.rows) {
        throw new UserApiError(
            'VERIFICATION_TOKEN_GENERATION_FAILED',
            'Verification token generation failed',
            StatusCodes.INTERNAL_SERVER_ERROR,
            ERROR_CODES.UNKNOWN_ERROR,
        );
      }

      mailer.sendEmailVerificationToken(body.email, verificationToken);

      return {
        verificationToken:
					envConfig.ENV === ENVIRONMENTS.DEVELOPMENT ? verificationToken : null,
        info: 'Verification email sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
	 *
	 * @param {string} token
	 * @return {Promise<{info: string}>}
	 */
  async verify(token) {
    try {
      const verifyTokenQuery = `SELECT user_id
																FROM data_captcha_tokens
																WHERE token = $1`;

      const verifyTokenResult = await pgsqlQuery(verifyTokenQuery, [token]);

      if (verifyTokenResult.rows.length === 0) {
        throw new UserApiError(
            'INVALID_TOKEN',
            'Invalid token',
            StatusCodes.BAD_REQUEST,
            ERROR_CODES.INVALID,
        );
      }

      const userId = verifyTokenResult.rows[0].user_id;

      const updateUserQuery = `UPDATE core_users
															 SET verification_status = 'verified'
															 WHERE user_id = $1`;

      const updateUserResult = await pgsqlQuery(updateUserQuery, [userId]);

      if (!updateUserResult.rows) {
        throw new UserApiError(
            'USER_VERIFICATION_FAILED',
            'User verification failed',
            StatusCodes.INTERNAL_SERVER_ERROR,
            ERROR_CODES.UNKNOWN_ERROR,
        );
      }

      const deleteTokenQuery = `DELETE
																FROM data_captcha_tokens
																WHERE token = $1`;

      await pgsqlQuery(deleteTokenQuery, [token]);

      return {
        info: 'User verified successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
	 *
	 * @param {{
	 *   email: string,
	 *   password: string
	 * }} body
	 * @return {Promise<*>}
	 */
  async login(body) {
    try {
      // Check if user exists
      const getUserQuery = `SELECT *
														FROM core_users
														WHERE email = $1`;

      const getUserResult = await pgsqlQuery(getUserQuery, [body.email]);

      if (getUserResult.rows.length === 0) {
        throw new UserApiError(
            'USER_NOT_FOUND',
            'User not found',
            StatusCodes.BAD_REQUEST,
            ERROR_CODES.INVALID,
        );
      }

      /**
			 * @type {{
			 *  user_id: string,
			 *  email: string,
			 *  password: string,
			 *  verification_status: string,
			 *  role_id: string
			 *  }}
			 */
      const user = getUserResult.rows[0];

      // Check if user is verified
      if (user.verification_status !== 'verified') {
        throw new UserApiError(
            'USER_NOT_VERIFIED',
            'User is not verified',
            StatusCodes.UNAUTHORIZED,
            ERROR_CODES.UNAUTHORIZED,
        );
      }

      // Compare password
      const isPasswordValid = await compareHash(body.password, user.password);

      if (!isPasswordValid) {
        throw new UserApiError(
            'INVALID_CREDENTIALS',
            'Invalid credentials',
            StatusCodes.BAD_REQUEST,
            ERROR_CODES.INVALID,
        );
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.user_id,
        email: user.email,
        role: user.role_id,
      });

      const refreshToken = generateRefreshToken({
        userId: user.user_id,
        email: user.email,
        role: user.role_id,
      });

      // update refresh token in db
      const updateRefreshTokenQuery = `
				INSERT INTO core_auth_tokens (token, user_id)
				VALUES ($1, $2) ON CONFLICT (user_id)
																							DO
				UPDATE SET token = $1`;

      await pgsqlQuery(updateRefreshTokenQuery, [refreshToken, user.user_id]);

      // update last login time
      const updateLastLoginQuery = `UPDATE core_users
																		SET last_logged_in = NOW()
																		WHERE user_id = $1`;

      await pgsqlQuery(updateLastLoginQuery, [user.user_id]);

      return { token, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  /**
	 * Refresh token
	 * @param {string} token
	 * @return {Promise<{token: (string), refreshToken: (string)}>}
	 */
  async refreshToken(token) {
    try {
      const verifyRefreshTokenQuery = `SELECT *
																			 FROM core_auth_tokens
																			 WHERE token = $1`;

      const verifyRefreshTokenResult = await pgsqlQuery(
          verifyRefreshTokenQuery,
          [token],
      );

      if (
        verifyRefreshTokenResult.rows.length === 0 ||
				!verifyRefreshToken(token)
      ) {
        throw new UserApiError(
            'INVALID_REFRESH_TOKEN',
            'Invalid refresh token',
            StatusCodes.UNAUTHORIZED,
            ERROR_CODES.UNAUTHORIZED,
        );
      }

      const user = verifyRefreshTokenResult.rows[0];

      const newToken = generateToken({
        userId: user.user_id,
        email: user.email,
        role: user.role_id,
      });

      const newRefreshToken = generateRefreshToken({
        userId: user.user_id,
        email: user.email,
        role: user.role_id,
      });

      const updateRefreshTokenQuery = `UPDATE core_auth_tokens
																			 SET token = $1
																			 WHERE user_id = $2`;

      await pgsqlQuery(updateRefreshTokenQuery, [
        newRefreshToken,
        user.user_id,
      ]);

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw error;
    }
  }

  /**
	 * Forgot password
	 * @param {{
	 *   email: string
	 * }} body
	 * @return {Promise<{token: (string|null), info: string}>}
	 */
  async forgotPassword(body) {
    try {
      const getUserQuery = `SELECT *
														FROM core_users
														WHERE email = $1`;

      const getUserResult = await pgsqlQuery(getUserQuery, [body.email]);

      if (getUserResult.rows.length === 0) {
        throw new UserApiError(
            'USER_NOT_FOUND',
            'User not found',
            StatusCodes.BAD_REQUEST,
            ERROR_CODES.INVALID,
        );
      }

      const user = getUserResult.rows[0];

      const resetToken = generateVerificationToken();

      const insertResetTokenQuery = `INSERT INTO data_captcha_tokens (user_id, token)
																		 VALUES ($1, $2)`;

      await pgsqlQuery(insertResetTokenQuery, [user.user_id, resetToken]);

      mailer.sendPasswordResetToken(body.email, resetToken);

      return {
        token: envConfig.ENV === ENVIRONMENTS.DEVELOPMENT ? resetToken : null,
        info: 'Password reset email sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
	 *
	 * @param {string} token
	 * @param {{
	 *   password: string
	 * }} body
	 * @return {Promise<{info: string}>}
	 */
  async resetPassword(token, body) {
    try {
      const verifyTokenQuery = `SELECT *
																FROM data_captcha_tokens
																WHERE token = $1`;

      const verifyTokenResult = await pgsqlQuery(verifyTokenQuery, [token]);

      if (verifyTokenResult.rows.length === 0) {
        throw new UserApiError(
            'INVALID_TOKEN',
            'Invalid token',
            StatusCodes.BAD_REQUEST,
            ERROR_CODES.INVALID,
        );
      }

      const userId = verifyTokenResult.rows[0].user_id;

      const hashedPassword = await generateHash(body.password);

      const updatePasswordQuery = `UPDATE core_users
																	 SET password = $1
																	 WHERE user_id = $2`;

      await pgsqlQuery(updatePasswordQuery, [hashedPassword, userId]);

      const deleteTokenQuery = `DELETE
																FROM data_captcha_tokens
																WHERE token = $1`;

      await pgsqlQuery(deleteTokenQuery, [token]);

      return {
        info: 'Password reset successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
	 * Get user profile
	 * @param {{
	 *   userId: string
	 * }} user
	 * @return {Promise<{user: *}>}
	 */
  async getProfile(user) {
    try {
      const getUserQuery = `SELECT *
														FROM data_profiles
														WHERE user_id = $1`;

      const getUserResult = await pgsqlQuery(getUserQuery, [user.userId]);

      if (getUserResult.rows.length === 0) {
        throw new UserApiError(
            'PROFILE_NOT_FOUND',
            'User not found',
            StatusCodes.BAD_REQUEST,
            ERROR_CODES.INVALID,
        );
      }

      return {
        user: getUserResult.rows[0],
      };
    } catch (error) {
      throw error;
    }
  }

  /**
	 * Update profile
	 * @param {string} userId
	 * @param {{
	 * fullName: string,
	 * bio: string,
	 * profilePicture: string,
	 * location: string,
	 * addressLine1: string,
	 * addressLine2: string
	 * }} body
	 * @return {Promise<{
	 *   info: string
	 * }>}
	 */
  async updateProfile(userId, body) {
    try {
      logger.debug(userId);
      const updateProfileQuery = `INSERT INTO data_profiles (full_name, bio,
																		profile_picture, location, address_line_1,
																		address_line_2, user_id)
				 VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (user_id)
																	DO
				UPDATE SET
					full_name = $1, bio = $2, profile_picture = $3,
					location = $4, address_line_1 = $5, address_line_2 = $6`;

      const updateProfileQueryResult = await pgsqlQuery(updateProfileQuery, [
        body.fullName,
        body.bio,
        body.profilePicture,
        body.location,
        body.addressLine1,
        body.addressLine2,
        userId,
      ]);

      if (!updateProfileQueryResult.rows) {
        throw new UserApiError(
            'PROFILE_UPDATE_FAILED',
            'Profile update failed',
            StatusCodes.INTERNAL_SERVER_ERROR,
            ERROR_CODES.UNKNOWN_ERROR,
        );
      }

      return {
        info: 'Profile updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();
