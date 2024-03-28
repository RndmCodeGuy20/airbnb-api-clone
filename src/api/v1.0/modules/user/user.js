import { pgsqlQuery } from '#helpers/index';
import { ERROR_CODES } from '#constants/error-codes.constant';
import { UserApiError } from './error';
import { StatusCodes } from 'http-status-codes';
import {
  compareHash,
  generateHash,
  generateToken,
  generateVerificationToken,
  mailer,
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

      const insertVerificationTokenQuery = `INSERT INTO data_auth_tokens (user_id, token)
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

      await mailer.sendEmailVerificationToken(body.email, verificationToken);

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
	 * @return {Promise<{message: string}>}
	 */
  async verify(token) {
    try {
      const verifyTokenQuery = `SELECT user_id
																FROM data_auth_tokens
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
																FROM data_auth_tokens
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
	 * @return {Promise<void>}
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

      const user = getUserResult.rows[0];

      // Check if user is verified
      if (user.verification_status !== 'verified') {
        throw new UserApiError(
            'USER_NOT_VERIFIED',
            'User is not verified',
            StatusCodes.BAD_REQUEST,
            ERROR_CODES.INVALID,
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

      return { token };
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();
