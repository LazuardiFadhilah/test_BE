import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'DEFAULT_SECRET';

export const signJwt = (payload: object, expiresIn: string | number = '1d') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyJwt = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};