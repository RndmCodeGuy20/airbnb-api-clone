import { catchAsync } from '#utils/index';
import { userService } from './user';

export const controller = {
  register: catchAsync(async (req, res) => {
    const response = await userService.register(req.body);
    res.jsend.success(response, {
      info: 'User registered successfully',
    });
  }),
};
