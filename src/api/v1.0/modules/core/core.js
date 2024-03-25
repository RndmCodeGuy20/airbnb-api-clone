import { CoreApiError } from './error';
import { pkgConfig } from '#configs/index';
import { redis } from '#helpers/index';
import { debug } from '#utils/debug';

/**
 * CoreServices
 * @class
 * @description Core services
 * @version 1.0
 */
class CoreServices {
  /**
	 * getData
	 * @param { string } query
	 * @return {Promise<{name: *, version: *, timestamp: string}>}
	 */
  async getData(query) {
    try {
      debug(query);
      if (!query) {
        throw new CoreApiError('Invalid query', 'Invalid query', 400);
      }

      // const data = await prismaQuery('data_users', {
      //   name: 'admin',
      // });

      const data = await redis.hgetall('user:1');

      const response = {
        name: pkgConfig.APP_NAME,
        version: pkgConfig.APP_VERSION,
        timestamp: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} IST`,
        data: data,
      };

      return response;
    } catch (e) {
      throw e;
    }
  }
}

export const coreService = new CoreServices();
