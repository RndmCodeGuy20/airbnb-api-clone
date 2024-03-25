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
        expiresIn: '90d',
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
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      e.name = 'User Session Expired';
      e.status = 401;
      e.errorCode = ERROR_CODES.UNAUTHENTICATED;
      throw e;
    }

    throw e;
  }
};

export const verifyTokenWithoutExpiration = (token) => {
  try {
    return jwt.verify(token, envConfig.JWT_SECRET_KEY, {
      ignoreExpiration: true,
    });
  } catch (err) {
    throw err;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, envConfig.JWT_SECRET_KEY);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      err.message = 'Refresh Token Expired';
      err.status = 403;
      err.errorCode = ERROR_CODES.UNAUTHORIZED;
      throw err;
    }
    throw err;
  }
};
