import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const { JWT_SECRET } = process.env;

export const verifyToken = async (req, res, next) => {
  const { token } = req.session;
  const { auth } = req.session;

  // if no token is found, it means that user is not logged in
  if (!token) {
    return res.status(401).json({ message: 'Veuillez vous authentifier' });
  }

  // if token is found, check if it is still valid
  await jwt.verify(token, JWT_SECRET, async (error, decoded) => {
    if (error) {
      console.error(error);
      // if it is not valid anymore, logout user
      auth.isLogged = false;
      return res.status(403).json({ error: 'Veuillez vous reconnecter' });
    }
    req.userId = decoded.id;
    next();
  });
};
