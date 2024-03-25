/* eslint-disable no-console */
import { createClient } from 'redis';
import { envConfig } from '#configs/index';
import { logger } from '#helpers/index';

let errorCount = 0;
const TTL = '300';

const redisUrl = `redis://${envConfig.REDIS.REDIS_HOST}:${envConfig.REDIS.REDIS_PORT}`;

let client;
(async () => {
  try {
    client = createClient({
      url: redisUrl,
    });

    client.on('connect', () => {
      logger.log('verbose', 'Successfully connected to Redis server!!');
    });

    client.on('ready', () => {
      logger.log('verbose', 'Redis server is ready to use!');
    });

    client.on('reconnecting', () => {
      logger.log('verbose', 'Trying to reconnect to Redis server...');
    });

    client.on('end', () => {
      logger.log('verbose', 'Connection to Redis server has been closed!');
    });

    client.on('error', (err) => {
      logger.log('error', `Error: ${err}`);
      logger.log('info', 'Trying to reconnect to Redis server...');
      errorCount++;
      client.quit();
      setTimeout(() => {
        if (errorCount > 2) {
          logger.log('error', 'Failed to reconnect to Redis server!');
          throw err;
        }
        client = createClient(envConfig.REDIS.REDIS_PORT);
      }, 2000);
    });
  } catch (error) {
    logger.log('error', `Error: ${error}`);
    throw error;
  }

  try {
    await client.connect();
  } catch (error) {
    logger.log('error', `Error: ${error}`);
    throw error;
  }
})();

export const redis = {
  get: async (key) => {
    const result = await client.get(key);
    try {
      return JSON.parse(result);
    } catch {
      return result;
    }
  },
  set: async (key, value) => {
    if (typeof value === 'object') {
      await client.set(key, JSON.stringify(value));
    } else {
      await client.set(key, value);
    }
    return true;
  },
  hget: async (key, field) => {
    const result = await client.hGet(key, field);
    try {
      return JSON.parse(result);
    } catch {
      return result;
    }
  },
  hmget: async (key, fields) => {
    const result = await client.hmGet(key, fields);
    try {
      return JSON.parse(result);
    } catch {
      return result;
    }
  },
  hgetall: async (key) => {
    const result = await client.hGetAll(key);
    try {
      return JSON.parse(result);
    } catch {
      return result;
    }
  },
  hset: async (key, field, value) => {
    if (typeof value === 'object') {
      await client.hSet(key, field, JSON.stringify(value));
    } else {
      await client.hSet(key, field, value);
    }
    return true;
  },
  hmset: async (key, fieldValueObject) => {
    if (typeof fieldValueObject === 'object') {
      await client.hSet(key, fieldValueObject);
    } else {
      return false;
    }
    return true;
  },
  exists: async (key) => {
    const result = await client.exists(key);
    return result;
  },
  expire: async (key, EX = TTL) => {
    await client.expire(key, EX);
    return true;
  },
  delete: async (key) => {
    await client.del(key);
    return true;
  },
  deleteField: async (key, field) => {
    await client.hDel(key, field);
    return true;
  },
  quit: async () => {
    await client.quit();
  },
};
