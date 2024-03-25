import { Router } from 'express';
import { getHealth } from './health';
import v1 from './v1.0';
import { routeNotFound } from '#middlewares/routes.middleware';

const router = new Router();

router.get('/health', getHealth);
router.use('/v1.0', v1);
router.all('*', routeNotFound);

export default router;
