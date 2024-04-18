import Joi from 'joi';

export const schema = {
  createListing: {
    body: Joi.object({
      title: Joi.string().required().label('Title'),
      description: Joi.string().required().label('Description'),
      pricePerNight: Joi.number().required().label('Price Per Night'),
      addressLine1: Joi.string().required().label('Address Line 1'),
      addressLine2: Joi.string().label('Address Line 2'),
      city: Joi.string().required().label('City'),
      state: Joi.string().required().label('State'),
      country: Joi.string().required().label('Country'),
      zipCode: Joi.string().required().label('Zip Code'),
      propertyType: Joi.string().required().label('Property Type'),
      latitude: Joi.number().required().label('Latitude'),
      longitude: Joi.number().required().label('Longitude'),
    }),
  },
};
