import { pkgConfig } from '#configs/index';

/**
 * Get health
 * @param {{}} req
 * @param {{}} res
 * @param {{}} next
 * @return {Promise<void>}
 */
export const getHealth = async (req, res, next) => {
  // await getPGConnection();
  try {
    res.jsend.success(
        {
          name: pkgConfig.APP_NAME,
          version: pkgConfig.APP_VERSION,
          timestamp: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} IST`,
          db_status: 'active',
        },
        {
          info: 'You are on health route all systems active.',
        },
        200,
    );
  } catch (err) {
    next(err);
  }
};
