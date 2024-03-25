import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { ERROR_CODES } from '#constants/index';

/**
 * MethodNotAllowedError
 * @extends {Error}
 * @description Method not allowed error
 * @version 1.0
 * @example
 * throw new MethodNotAllowedError("Method not allowed", 405, 405);
 */
class MethodNotAllowedError extends Error {
  /**
	 * MethodNotAllowedError
	 * @param {string} message
	 * @param {string} httpStatus
	 * @param {string} errorCode
	 */
  constructor(message, httpStatus, errorCode) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = httpStatus;
    this.errorCode = errorCode;
  }
}

/**
 * methodNotAllowed
 * @description Method not allowed
 * @throws {MethodNotAllowedError}
 * @version 1.0
 * @example
 * methodNotAllowed();
 */
export const methodNotAllowed = () => {
  try {
    // logger.log('error', 'Method not allowed', { label: 'ERROR' });
    throw new MethodNotAllowedError(
        ReasonPhrases.METHOD_NOT_ALLOWED,
        StatusCodes.METHOD_NOT_ALLOWED.toString(),
        ERROR_CODES.NOT_ALLOWED,
    );
  } catch (error) {
    throw error;
  }
};

/**
 * RouteNotFoundError
 * @extends {Error}
 * @description Route not found error
 * @version 1.0
 * @example
 * throw new RouteNotFoundError("Route not found", 404, 404);
 */
class RouteNotFoundError extends Error {
  /**
	 * RouteNotFoundError
	 * @param {string} message
	 * @param {string} httpStatus
	 * @param {string} errorCode
	 */
  constructor(message, httpStatus, errorCode) {
    super(message);
    this.name = this.constructor.name;
    this.status = httpStatus;
    this.errorCode = errorCode;
  }
}

/**
 * routeNotFound
 * @description Route not found
 * @throws {RouteNotFoundError}
 * @version 1.0
 *
 */
export const routeNotFound = () => {
  try {
    throw new RouteNotFoundError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND.toString(),
        ERROR_CODES.NOT_FOUND,
    );
  } catch (error) {
    throw error;
  }
};
