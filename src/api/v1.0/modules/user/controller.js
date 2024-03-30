import { catchAsync } from '#utils/index';
import { userService } from './user';
import { ERROR_CODES } from '#constants/error-codes.constant';

export const controller = {
  register: catchAsync(async (req, res) => {
    const response = await userService.register(req.body);
    res.jsend.success(response, 'REGISTRATION_SUCCESSFUL');
  }),
  verify: catchAsync(async (req, res) => {
    const response = await userService.verify(req.params.token);
    res.jsend.success(response, 'VERIFICATION_SUCCESSFUL');
  }),
  login: catchAsync(async (req, res) => {
    const response = await userService.login(req.body);
    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    res.jsend.success(response.token, 'LOGIN_SUCCESSFUL');
  }),
  refreshToken: catchAsync(async (req, res) => {
    const { refreshToken, token } = await userService.refreshToken(
        req.cookies.refreshToken,
    );

    if (!refreshToken) {
      res.clearCookie('refreshToken');
      res.jsend.fail('REFRESH_TOKEN_EXPIRED', null, ERROR_CODES.INVALID);
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    res.jsend.success(
        {
          token: token,
        },
        'TOKEN_REFRESHED',
    );
  }),
  forgotPassword: catchAsync(async (req, res) => {
    const response = await userService.forgotPassword(req.body);
    res.jsend.success(response, 'PASSWORD_RESET_EMAIL_SENT');
  }),
  resetPassword: catchAsync(async (req, res) => {
    const response = await userService.resetPassword(
        req.params.token,
        req.body,
    );
    res.jsend.success(response, 'PASSWORD_RESET_SUCCESSFUL');
  }),
  protectedRoute: catchAsync(async (req, res) => {
    res.jsend.success(req.user, 'PROTECTED_ROUTE');
  }),
};
