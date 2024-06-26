import { Router } from 'express';
import coreRouter from './modules/core/routes';
import userRoutes from './modules/user/routes';
import listingRoutes from './modules/listing/routes';

const router = new Router();

router.get('/', (req, res) => {
  res.jsend.success(
      {
        timestamp: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} IST`,
      },
      'V1.0 API',
  );
});

router.use(userRoutes);
router.use(listingRoutes);
router.use(coreRouter);

export default router;
