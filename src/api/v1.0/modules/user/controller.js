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
    res.jsend.success(response, 'LOGIN_SUCCESSFUL');
  }),
};
