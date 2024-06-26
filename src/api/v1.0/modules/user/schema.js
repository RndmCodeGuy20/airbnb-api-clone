import Joi from 'joi';

export const schema = {
  register: {
    body: Joi.object({
      // fullName: Joi.string()
      //     .required()
      //     .label('Full Name')
      //     .pattern(new RegExp("^[A-Z a-z,.'-]+$")),
      // username: Joi.string()
      //     .required()
      //     .label('Username')
      //     .pattern(new RegExp('^[a-z0-9]+$')),
      email: Joi.string().required().label('Email').email(),
      role: Joi.string()
          .required()
          .label('Role')
          .valid('user', 'admin', 'moderator'),
      password: Joi.string()
          .required()
          .label('Password')
          .pattern(
              new RegExp(
                  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
              ),
          ),
    }),
  },

  login: {
    body: Joi.object({
      email: Joi.string().required().label('Email').email(),
      // username: Joi.string()
      //     .required()
      //     .label('Username')
      //     .pattern(new RegExp('^[a-z0-9]+$')),
      password: Joi.string().required().label('Password'),
    }).or('email', 'username'),
  },

  loginOTP: {
    body: Joi.object({
      email: Joi.string().required().label('Email').email(),
      username: Joi.string()
          .required()
          .label('Username')
          .pattern(new RegExp('^[a-z0-9]+$')),
      otp: Joi.string()
          .required()
          .label('OTP')
          .pattern(new RegExp('^[0-9]{6}$')),
    }).or('email', 'username'),
  },

  forgotPassword: {
    body: Joi.object({
      email: Joi.string().required().label('Email').email(),
      username: Joi.string()
          .label('Username')
          .pattern(new RegExp('^[a-z0-9]+$')),
    }).or('email', 'username'),
  },

  resetPassword: {
    params: Joi.object({
      token: Joi.string().required().label('Token'),
    }),
    body: Joi.object({
      password: Joi.string()
          .required()
          .label('Password')
          .pattern(
              new RegExp(
                  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
              ),
          ),
    }),
  },

  refresh: {
    body: Joi.object({
      refreshToken: Joi.string().required().label('Refresh Token'),
    }),
  },

  updateProfile: {
    body: Joi.object({
      fullName: Joi.string()
          .required()
          .label('Full Name')
          .pattern(new RegExp("^[A-Z a-z,.'-]+$")),
      bio: Joi.string().label('Bio'),
      profilePicture: Joi.string().label('Profile Picture'),
      location: Joi.string().label('Location'),
      addressLine1: Joi.string()
          .required()
          .label('Address Line 1')
          .pattern(new RegExp('^[a-zA-Z0-9, ]+$')),
      addressLine2: Joi.string()
          .label('Address Line 2')
          .pattern(new RegExp('^[a-zA-Z0-9, ]+$')),
    }),
  },
};
