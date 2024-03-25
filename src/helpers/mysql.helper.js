import { logger } from '#helpers/index';
import { envConfig } from '#configs/index';

const util = require('util');
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: envConfig.DB.DB_HOST,
  user: envConfig.DB.DB_USER,
  password: envConfig.DB.DB_PASSWORD,
  database: envConfig.DB.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Get connection
 * @return {Promise<unknown>}
 */
export const getConnection = async () => {
  const dbPromise = new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          logger.log('error', 'Database connection was closed.');
          reject(new Error('Database connection was closed.'));
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
          logger.log('error', 'Database has too many connections.');
          reject(new Error('Database has too many connections.'));
        }
        if (err.code === 'ECONNREFUSED') {
          logger.log('error', 'Database connection was refused.');
          reject(new Error('Database connection was refused.'));
        }
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
          logger.log('error', 'Database access denied.');
          reject(new Error('Database access denied.'));
        }
      }

      if (connection) {
        logger.log(
            'verbose',
            `Connected to the database: ${envConfig.DB.DB_NAME}`,
        );
        const rollback = util.promisify(connection.rollback).bind(connection);
        const query = util.promisify(connection.query).bind(connection);
        const commit = util.promisify(connection.commit).bind(connection);
        resolve({ rollback, query, commit });
      }
    });
  });

  return await dbPromise;
};

/**
 * Query database
 * @type {any}
 */
export const mysqlQuery = util.promisify(pool.query).bind(pool);
