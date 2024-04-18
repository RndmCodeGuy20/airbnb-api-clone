/**
 * @apiDefine ListingApiError
 * @apiVersion 1.0.0
 * @apiError ListingApiError ListingApiError
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Error message",
 *   "info": "Error info",
 *   "status": STATUS_CODE,
 *   "errorCode": "ERROR_CODE"
 * }
 */
class ListingApiError extends Error {
  /**
	 * Creates an instance of ListingApiError.
	 * @param {string} message
	 * @param {string} info
	 * @param {number} status
	 * @param {string} errorCode
	 */
  constructor(message, info, status, errorCode) {
    super(message);
    this.name = 'ListingApiError';
    this.info = info;
    this.status = status;
    this.errorCode = errorCode;
  }
}

export { ListingApiError };
