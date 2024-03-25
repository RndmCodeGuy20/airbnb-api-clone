import { logger } from '#helpers/index';

export const loggerMiddleware = (req, res, next) => {
  logger.log('info', `${req.method} ${req.url}`, { label: 'API' });
  next();
};
