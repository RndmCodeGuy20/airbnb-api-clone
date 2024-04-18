import { logger, pgsqlQuery } from '#helpers/index';
import { ListingApiError } from './error';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '#constants/index';

/**
 * @class ListingService
 * @description Service layer for listing module
 */
class ListingService {
  /**
	 * @method createListing
	 * @description Method to create a new listing
	 * @param {string} hostId
	 * @param {{
	 *   title: string,
	 *   description: string,
	 *   pricePerNight: number,
	 *   addressLine1: string,
	 *   addressLine2: string,
	 *   city: string,
	 *   state: string,
	 *   country: string,
	 *   zipCode: string,
	 *   propertyType: string,
	 *   latitude: number,
	 *   longitude: number,
	 * }} data
	 * @return {Promise<{info: {listing_id: *}}>}
	 */
  async createListing(hostId, data) {
    // check if host exists and also that user is a host
    const checkHostQuery = `
			SELECT email, role_name
			FROM core_users
						 JOIN core_roles ON core_users.role_id = core_roles.role_id
			WHERE user_id = $1;
		`;

    const checkHostResult = await pgsqlQuery(checkHostQuery, [hostId]);

    if (checkHostResult.rows[0].role_name !== 'host') {
      const setHostRoleQuery = `UPDATE core_users
																SET role_id =
																			(SELECT role_id
																			 FROM core_roles
																			 WHERE role_name = 'host')
																WHERE user_id = $1;`;

      await pgsqlQuery(setHostRoleQuery, [hostId]);
    }

    // create listing
    const createListingQuery = `INSERT INTO data_listings(host_id, title,
																 description,
																 price_per_night,
																 address_line_1, address_line_2,
																 city,
																 state,
																 zip_code,
																 country,
																 latitude, longitude)
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`;

    const createListingQueryResult = await pgsqlQuery(createListingQuery, [
      hostId,
      data.title,
      data.description,
      data.pricePerNight,
      data.addressLine1,
      data.addressLine2,
      data.city,
      data.state,
      data.zipCode,
      data.country,
      data.latitude,
      data.longitude,
    ]);

    if (createListingQueryResult.rowCount === 0) {
      logger.error('Error creating listing');
      throw new ListingApiError(
          'LISTING_NOT_CREATED',
          'Error creating listing',
          StatusCodes.INTERNAL_SERVER_ERROR,
          ERROR_CODES.UNKNOWN_ERROR,
      );
    }

    return {
      info: {
        listing_id: createListingQueryResult.rows[0].listing_id,
      },
    };
  }
}

export const listingService = new ListingService();
