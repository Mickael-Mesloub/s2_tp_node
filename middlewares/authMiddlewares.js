import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const { JWT_SECRET } = process.env;

export const verifyToken = async (req, res, next) => {
  let authToken = req.headers.authorization;

  const token = authToken && authToken.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Veuillez vous authentifier' });
  }

  await jwt.verify(token, JWT_SECRET, async (error, decoded) => {
    if (error) {
      console.log(` ${error}`);
      return res.status(403).json({ error: 'Veuillez vous reconnecter' });
    }
    req.userId = decoded.id;
    next();
  });
};
