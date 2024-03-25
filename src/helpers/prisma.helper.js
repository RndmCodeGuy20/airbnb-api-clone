import { PrismaClient } from '@prisma/client';
import { logger } from '#helpers/index';

const prisma = new PrismaClient();

/**
 * Query data using Prisma
 * @param {string} model - The Prisma model name
 * @param {Object} [where] - Optional WHERE clause filters (refer to Prisma docs)
 * @param {Object} [options] - Optional query options (e.g., select, sort, etc.)
 * @return {Promise<any[]>} - An array of results
 */
export async function prismaQuery(model, where = {}, options = {}) {
  try {
    return await prisma[model].findMany({
      where,
      ...options,
    });
  } catch (e) {
    logger.log('error', e);
    throw e;
  }
}
