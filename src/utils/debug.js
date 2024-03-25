import { logger } from '#helpers/index';

export const debug = (data, level = 'debug') => {
  logger.log(level, data, {
    label: 'DEBUG',
    service: 'debug',
  });
};
