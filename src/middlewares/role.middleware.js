import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '#constants/index';

/**
 * Role middleware
 */
class RoleMiddlewareError extends Error {
  /**
	 *
	 * @param {string}message
	 * @param {string} info
	 * @param {number} httpStatus
	 * @param {string} errorCode
	 */
  constructor(message, info, httpStatus, errorCode) {
    super(message);
    this.info = info;
    this.name = 'RoleMiddlewareError';
    this.status = httpStatus;
    this.errorCode = errorCode;
  }
}

export const validateRole = (...roles) => {
  // eslint-disable-next-line consistent-return
  return (req, res, next) => {
    try {
      const { role } = res.locals.user;
      if (roles && roles.length > 0 && !roles.includes(role.code)) {
        throw new RoleMiddlewareError(
            'ROLE_NOT_ALLOWED',
            'Role Not Allowed',
            StatusCodes.UNAUTHORIZED,
            ERROR_CODES.UNAUTHORIZED,
        );
      }
      return next();
    } catch (error) {
      throw error;
    }
  };
};
