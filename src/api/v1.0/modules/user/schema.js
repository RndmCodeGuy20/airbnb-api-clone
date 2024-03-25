import Joi from 'joi';

export const schema = {
  register: {
    body: Joi.object({
      fullName: Joi.string()
          .required()
          .label('Full Name')
          .pattern(new RegExp("^[A-Z a-z,.'-]+$")),
      username: Joi.string()
          .required()
          .label('Username')
          .pattern(new RegExp('^[a-z0-9]+$')),
      email: Joi.string().required().label('Email').email(),
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
      username: Joi.string()
          .required()
          .label('Username')
          .pattern(new RegExp('^[a-z0-9]+$')),
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
          .required()
          .label('Username')
          .pattern(new RegExp('^[a-z0-9]+$')),
    }).or('email', 'username'),
  },
};
