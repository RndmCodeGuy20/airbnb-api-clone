import { Router } from 'express';
import { controller as api } from './controller';
import { methodNotAllowed } from '#middlewares/index';

const router = new Router();

router.route('/core/get-data').get(api.getData).all(methodNotAllowed);

module.exports = router;
