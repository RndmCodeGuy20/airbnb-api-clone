import { coreService } from './core';
import { catchAsync } from '#utils/index';

export const controller = {
  getData: catchAsync(async (req, res) => {
    const response = await coreService.getData(req.query);
    res.jsend.success(response, 'Data fetched successfully');
  }),
};
