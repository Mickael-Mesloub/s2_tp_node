import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const { CRYPTO_SECRET } = process.env;

// capitalize the first letter of a string
export const capitalize = (str) => {
  return str.replace(str[0], str[0].toUpperCase());
};

// trim inputs data
export const trimData = (data) => {
  for (const key in data) {
    if (typeof data[key] === 'string') data[key] = data[key]?.trim() ?? '';
  }
  return data;
};

// hash password
export const hashPassword = (password) => {
  const sha256hasher = crypto.createHmac('sha256', CRYPTO_SECRET);
  sha256hasher.update(password);
  return sha256hasher.digest('hex');
};
