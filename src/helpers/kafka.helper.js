import { Kafka } from 'kafkajs';
import { logger } from '#helpers/index';
import { envConfig } from '#configs/index';

const options = {
  clientId: envConfig.KAFKA.KAFKA_CLIENT_ID,
  brokers: ['localhost:9092'],
  logLevel: 1,
  ssl: false,
};

const kafka = new Kafka(options);

const admin = kafka.admin();

const producer = kafka.producer();
const consumer = kafka.consumer({
  groupId: envConfig.KAFKA.KAFKA_GROUP_ID,
});

/**
 * Start Kafka
 * @return {Promise<void>}
 */
async function initKafka() {
  try {
    admin
        .connect()
        .then(() => {
          logger.log('verbose', 'Kafka admin connected');
        })
        .catch((error) => {
          logger.log('error', error);
        });

    admin
        .createTopics({
          topics: [{ topic: envConfig.KAFKA.KAFKA_TOPIC }],
        })
        .then(() => {
          logger.log('verbose', `Topic created ${envConfig.KAFKA.KAFKA_TOPIC}`);
        })
        .catch((error) => {
          logger.log('error', error);
        });

    await producer.connect();
    await consumer.connect();
    logger.log('verbose', 'Kafka initialized successfully!');
  } catch (e) {
    // logger.log('error', e);
    throw e;
  }
}

module.exports = {
  producer,
  consumer,
  admin,
  initKafka,
  produceMessage: async (topic, message) => {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  },
  consumeMessage: async (topic, callback) => {
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        callback(message);
      },
    });
  },
};
