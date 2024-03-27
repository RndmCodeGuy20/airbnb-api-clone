import crypto from 'crypto';

// Generate a verification token
export const generateVerificationToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Generate a password reset token
export const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
