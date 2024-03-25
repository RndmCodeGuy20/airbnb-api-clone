import { hostname } from 'os';

const env = require('dotenv');
env.config({
  path: process.env.NODE_ENV === 'development' ? '.env.local' : '.env',
});

const {
  NODE_ENV,
  APP_PORT,
  APP_HOST,
  DB_HOST,
  MYSQL_DB_PORT,
  POSTGRES_DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  KAFKA_HOST,
  KAFKA_PORT,
  KAFKA_CLIENT_ID,
  KAFKA_GROUP_ID,
  KAFKA_TOPIC,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  JWT_SECRET,
} = process.env;

export const envConfig = {
  ENV: NODE_ENV,
  PORT: APP_PORT,
  HOST: APP_HOST,
  HOSTNAME: hostname(),
  DB: {
    DB_HOST: DB_HOST,
    MYSQL_DB_PORT: MYSQL_DB_PORT,
    POSTGRES_DB_PORT: POSTGRES_DB_PORT,
    DB_USER: DB_USER,
    DB_PASSWORD: DB_PASSWORD,
    DB_NAME: DB_NAME,
  },
  KAFKA: {
    KAFKA_HOST: KAFKA_HOST,
    KAFKA_PORT: KAFKA_PORT,
    KAFKA_CLIENT_ID: KAFKA_CLIENT_ID,
    KAFKA_GROUP_ID: KAFKA_GROUP_ID,
    KAFKA_TOPIC: KAFKA_TOPIC,
  },
  REDIS: {
    REDIS_HOST: REDIS_HOST,
    REDIS_PORT: REDIS_PORT,
    REDIS_PASSWORD: REDIS_PASSWORD,
  },
  JWT_SECRET_KEY: JWT_SECRET,
};
