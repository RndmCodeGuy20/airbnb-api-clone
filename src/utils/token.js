import { envConfig, tokenConfig } from '#configs/index';
import { ERROR_CODES } from '#constants/index';

const jwt = require('jsonwebtoken');

export const generateToken = (tokenData) => {
  return jwt.sign(
      {
        data: tokenData,
      },
      envConfig.JWT_SECRET_KEY,
      {
        expiresIn: tokenConfig.TOKEN_LIFE,
      },
  );
};

export const generateRefreshToken = (tokenData) => {
  return jwt.sign(
      {
        data: tokenData,
      },
      envConfig.JWT_SECRET_KEY,
      {
        expiresIn: tokenConfig.REFRESH_TOKEN_LIFE,
      },
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, envConfig.JWT_SECRET_KEY);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      error.info = 'TOKEN_EXPIRED';
      error.name = 'User Session Expired';
      error.status = 401;
      error.errorCode = ERROR_CODES.UNAUTHENTICATED;
      throw error;
    }

    throw error;
  }
};

export const verifyTokenWithoutExpiration = (token) => {
  try {
    return jwt.verify(token, envConfig.JWT_SECRET_KEY, {
      ignoreExpiration: true,
    });
  } catch (error) {
    throw error;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, envConfig.JWT_SECRET_KEY);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      error.info = 'REFRESH_TOKEN_EXPIRED';
      error.message = 'Refresh Token Expired';
      error.status = 403;
      error.errorCode = ERROR_CODES.UNAUTHORIZED;
      throw error;
    }
    throw error;
  }
};
