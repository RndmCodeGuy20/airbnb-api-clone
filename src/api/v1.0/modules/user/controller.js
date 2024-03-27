import { catchAsync } from '#utils/index';
import { userService } from './user';

export const controller = {
  register: catchAsync(async (req, res) => {
    const response = await userService.register(req.body);
    res.jsend.success(response, {
      info: 'User registered successfully',
    });
  }),
  verify: catchAsync(async (req, res) => {
    const response = await userService.verify(req.params.token);
    res.jsend.success(response, {
      info: 'User verified successfully',
    });
  }),
};
