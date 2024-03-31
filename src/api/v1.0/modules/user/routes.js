import { Router } from 'express';
import { controller as api } from './controller';
import {
  methodNotAllowed,
  validateSchema,
  validateUser,
} from '#middlewares/index';
import { schema } from './schema';

const router = new Router();

router
    .route('/auth/register')
    .post(validateSchema(schema.register), api.register)
    .all(methodNotAllowed);

router.route('/auth/verify/:token').get(api.verify).all(methodNotAllowed);

router
    .route('/auth/resend-verification-email')
    .post((req, res) => {
      res.send('Resend Verification Email');
    })
    .all(methodNotAllowed);

router
    .route('/auth/login')
    .post(validateSchema(schema.login), api.login)
    .all(methodNotAllowed);

router
    .route('/auth/forgot-password')
    .post(validateSchema(schema.forgotPassword), api.forgotPassword)
    .all(methodNotAllowed);

router
    .route('/auth/reset-password/:token')
    .post(validateSchema(schema.resetPassword), api.resetPassword)
    .all(methodNotAllowed);

router.route('/auth/refresh').post(api.refreshToken).all(methodNotAllowed);

router
    .route('/user/protected')
    .get(validateUser, api.protectedRoute)
    .all(methodNotAllowed);

router
    .route('/auth/logout')
    .post((req, res) => {
      res.send('Logout');
    })
    .all(methodNotAllowed);

router
    .route('/user/profile')
    .get(validateUser, api.getProfile)
    .patch(validateUser, validateSchema(schema.updateProfile), api.updateProfile)
    .all(methodNotAllowed);

module.exports = router;
