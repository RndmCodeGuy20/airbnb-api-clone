import { envConfig } from '#configs/index';
import { ENVIRONMENTS, ERROR_CODES } from '#constants/index';
import { logger } from '#helpers/index';

export const errorMiddleware = (error, req, res) => {
  error.details = Array.isArray(error.details) ?
		error.details.map((details) => details.message).join(', ') :
		[error.details];
  logger.log('error', error.message, {
    label: 'ERR',
    service: 'error-handler',
  });
  if (error.status < 500) {
    res.jsend.fail(
        error.message,
        {
          errorName: error.name,
          ...(envConfig.ENV === ENVIRONMENTS.DEVELOPMENT && {
            details: error.reason,
            stack: error.stack,
          }),
        },
        error.errorCode,
        parseInt(error.status.toString()),
    );
    return;
  }

  res.jsend.error(error.message, error.status, ERROR_CODES.UNKNOWN_ERROR, {
    errorName: error.name,
    reason: error.reason,
    code: error.errorCode,
    ...(envConfig.ENV === ENVIRONMENTS.DEVELOPMENT && {
      details: error.details,
    }),
  });
};
