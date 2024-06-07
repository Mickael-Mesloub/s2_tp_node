import express from 'express';
import { login, register } from '../controllers/authController.js';
import { renderDashboard } from '../controllers/dashboardController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import { renderHome } from '../controllers/home.js';
const router = express.Router();

router.get('/dashboard', verifyToken, renderDashboard);
router.post('/', register);
router.post('/login', login);
router.get('/', renderHome);

export default router;
