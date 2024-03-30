import { catchAsync } from '#utils/index';
import { userService } from './user';

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
  protectedRoute: catchAsync(async (req, res) => {
    res.jsend.success(req.user, 'PROTECTED_ROUTE');
  }),
};
