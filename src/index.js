import app from './app';
import { envConfig } from '#configs/index';
import { logger } from '#helpers/index';

let server;

const init = async () => {
  // await getConnection();
  // await getPGConnection();
  // await initKafka();
  // await consumeMessage(envConfig.KAFKA.KAFKA_TOPIC, (message) => {
  //   logger.log('verbose', `Message received: ${message.value.toString()}`);
  // });
  server = app.listen(envConfig.PORT, () => {
    logger.log(
        'verbose',
        `Listening on ${envConfig.HOSTNAME} http://localhost:${envConfig.PORT}`,
    );
  });
};

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.log('error', `unexpectedErrorHandler ${error}`);
  // console.log('unexpectedErrorHandler', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

/**
 * @description - start the server, handles promise rejections
 * and exits the process if an error occurs.
 */
init()
    .then(() => {
      logger.log('verbose', 'Server started successfully');
    })
    .catch((error) => {
      logger.error(error);
      process.exit(1);
    });
