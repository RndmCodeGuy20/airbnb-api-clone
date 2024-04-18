import { catchAsync } from '#utils/index';
import { listingService } from './listing';

export const controller = {
  createListing: catchAsync(async (req, res) => {
    const response = await listingService.createListing(
        res.locals.user.userId,
        req.body,
    );
    res.jsend.success(response, 'LISTING_CREATED');
  }),
};
