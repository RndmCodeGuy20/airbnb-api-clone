import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '#utils/index';
import { ERROR_CODES } from '#constants/index';
import { logger } from '#helpers/logger.helper';

/**
 * Authentication Middleware
 */
class AuthorizationMiddlewareError extends Error {
  /**
	 * Creates an instance of BuyerApiError.
	 * @param {string} message - Error message
	 * @param {string} info - Error info
	 * @param {number} httpStatus - HTTP status code
	 * @param {string} errorCode - Error code
	 */
  constructor(message, info, httpStatus, errorCode) {
    super(message);
    this.name = 'AuthorizationMiddlewareError';
    this.info = info;
    this.status = httpStatus;
    this.errorCode = errorCode;
  }
}

export const validateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AuthorizationMiddlewareError(
          'AUTH_HEADER_NOT_PRESENT',
          'Authorization header not present',
          StatusCodes.UNAUTHORIZED,
          ERROR_CODES.UNAUTHENTICATED,
      );
    }

    if (!authHeader.startsWith('Bearer')) {
      throw new AuthorizationMiddlewareError(
          'INVALID_AUTH_HEADER_TYPE',
          'Invalid authentication header type',
          StatusCodes.BAD_REQUEST,
          ERROR_CODES.INVALID,
      );
    }

    const token = authHeader.split(' ')[1];
    const tokenData = verifyToken(token);
    logger.debug(tokenData);
    res.locals.user = tokenData.data;

    return next();
  } catch (error) {
    throw error;
  }
};
