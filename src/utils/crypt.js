import bcrypt from 'bcrypt';

export const generateHash = async (plainText) => {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(plainText, salt);
};

export const compareHash = async (plainText, hash) => {
  return bcrypt.compareSync(plainText, hash);
};
