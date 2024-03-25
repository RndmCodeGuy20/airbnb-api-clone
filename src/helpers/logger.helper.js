import winston from 'winston';
import { envConfig } from '#configs/index';

winston.addColors(winston.config.syslog.colors);

const logger = winston.createLogger({
  level: 'silly',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.prettyPrint(),
  ),
  defaultMeta: { service: 'boot' },
  transports: [
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'warn',
    }),
    new winston.transports.File({ filename: './logs/combined.log' }),
  ],
});

if (envConfig.ENV !== 'production') {
  logger.add(
      new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({
              all: true,
              colors: {
                debug: 'blue',
                info: 'green',
                warn: 'yellow',
                error: 'red',
                verbose: 'italic cyan',
                http: 'magenta',
              },
            }),
            winston.format.splat(),
            winston.format.errors({ stack: true }),
            winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
            winston.format.json({
              space: 2,
              replacer: (key, value) => {
                if (key === 'timestamp') {
                  return undefined;
                }
                return value;
              },
            }),
            winston.format.printf(
                ({
                  timestamp,
                  level,
                  message,
                  label = 'boot',
                  stack,
                  ...metadata
                }) => {
                  let msg = {
                    timestamp,
                    level,
                    message,
                    label,
                    stack,
                  };

                  if (metadata) {
                    msg = { ...msg, ...metadata };
                  }

                  if (stack) {
                    msg.stack = stack;

                    // eslint-disable-next-line max-len
                    return `${msg.timestamp} [${msg.level}] ${msg.label ? `(${msg.label})` : ''}: ${msg.message}\n${msg.stack}`;
                  }

                  // eslint-disable-next-line max-len
                  return `${msg.timestamp} [${msg.level}] ${msg.label ? `(${msg.label})` : ''}: ${msg.message}`;
                },
            ),
        ),
      }),
  );
}

export { logger };
