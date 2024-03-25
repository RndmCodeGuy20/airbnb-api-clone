import { Router } from 'express';
import { controller as api } from './controller';
import { methodNotAllowed, validateSchema } from '#middlewares/index';
import { schema } from './schema';

const router = new Router();

router
    .route('/auth/register')
    .post(validateSchema(schema.register), api.register)
    .all(methodNotAllowed);

router
    .route('/auth/login')
    .post(validateSchema(schema.login), (req, res) => {
      res.send('Login');
    })
    .all(methodNotAllowed);

router
    .route('/auth/login/otp')
    .post((req, res) => {
      res.send('Login OTP');
    })
    .all(methodNotAllowed);

router
    .route('/auth/forgot-password')
    .post((req, res) => {
      res.send('Forgot Password');
    })
    .all(methodNotAllowed);

router
    .route('/auth/reset-password/:token')
    .post((req, res) => {
      res.send('Forgot Password');
    })
    .all(methodNotAllowed);

router
    .route('/auth/verify-email/:token')
    .get((req, res) => {
      res.send('Verify Email');
    })
    .all(methodNotAllowed);

router
    .route('/auth/resend-verification-email')
    .post((req, res) => {
      res.send('Resend Verification Email');
    })
    .all(methodNotAllowed);

router
    .route('/auth/logout')
    .post((req, res) => {
      res.send('Logout');
    })
    .all(methodNotAllowed);

router
    .route('/auth/refresh-token')
    .post((req, res) => {
      res.send('Refresh Token');
    })
    .all(methodNotAllowed);

router
    .route('auth/profile')
    .get((req, res) => {
      res.send('Profile');
    })
    .patch((req, res) => {
      res.send('Update Profile');
    })
    .all(methodNotAllowed);

module.exports = router;
