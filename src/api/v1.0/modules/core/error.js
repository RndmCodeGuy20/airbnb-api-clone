/**
 * Error class for Core API
 * @class
 * @extends Error
 * @description Core API Error
 * @version 1.0
 * @example
 * throw new CoreApiError("Invalid query", "Invalid query", 400);
 */
class CoreApiError extends Error {
  /**
	 * CoreApiError
	 * @param {string} message
	 * @param {string} error
	 * @param {number} code
	 */
  constructor(message, error, code) {
    super(message);
    this.error = error;
    this.code = code;
  }
}

export { CoreApiError };
