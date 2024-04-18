import { Router } from 'express';
import { controller as api } from './controller';
import { methodNotAllowed, validateUser } from '#middlewares/index';

const router = new Router();

router
    .route('/listing/create')
    .post(validateUser, api.createListing)
    .all(methodNotAllowed);

export default router;
