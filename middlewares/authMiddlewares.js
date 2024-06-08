import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const { JWT_SECRET } = process.env;

export const verifyToken = async (req, res, next) => {
  const { token } = req.session;
  const { auth } = req.session;

  // if no token is found, it means that user is not logged in
  if (!token) {
    const askLoginMsg = 'Veuillez vous authentifier';
    req.flash('warnings', askLoginMsg);
    return res.status(301).redirect('/login');
  }

  // if token is found, check if it is still valid
  await jwt.verify(token, JWT_SECRET, async (error, decoded) => {
    if (error) {
      // if it is not valid anymore, logout user
      auth.isLogged = false;
      const loginAgainMsg = 'Veuillez vous reconnecter';
      req.flash('warnings', loginAgainMsg);
      return res.status(301).redirect('/login');
    }
    req.userId = decoded.id;
    next();
  });
};
