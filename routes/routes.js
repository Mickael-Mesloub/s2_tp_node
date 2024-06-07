import express from 'express';
import { login, register } from '../controllers/authController.js';
import { getDashboard } from '../controllers/dashboardController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';
const router = express.Router();

router.get('/dashboard', verifyToken, getDashboard);
router.post('/register', register);
router.post('/', login);

export default router;
