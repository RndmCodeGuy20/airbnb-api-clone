import { logger } from '#helpers/index';
import { envConfig } from '#configs/index';
import * as util from 'util';

const { Pool } = require('pg');

const pool = new Pool({
  user: envConfig.DB.DB_USER,
  host: envConfig.DB.DB_HOST,
  database: envConfig.DB.DB_NAME,
  password: envConfig.DB.DB_PASSWORD,
  port: envConfig.DB.POSTGRES_DB_PORT,
});

export const getPGConnection = async () => {
  const dbPromise = new Promise((resolve, reject) => {
    pool.connect((err, connection, done) => {
      if (err) {
        logger.log('error', 'Database connection error', err);
        reject(err);
      }

      if (connection) {
        logger.log(
            'verbose',
            `Connected to the database: ${envConfig.DB.DB_NAME}`,
        );
        const query = connection.query.bind(connection);
        const rollback = connection.query.bind(connection);
        const commit = connection.query.bind(connection);
        resolve({ rollback, query, commit });
      }
    });
  });

  return await dbPromise;
};

export const pgsqlQuery = util.promisify(pool.query).bind(pool);
