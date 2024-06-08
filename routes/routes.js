import express from 'express';
import { login, logout, register } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import { renderHome } from '../controllers/page_renderers/home.js';
import { renderLogin } from '../controllers/page_renderers/login.js';
import { renderDashboard } from '../controllers/page_renderers/dashboard.js';
const router = express.Router();

router.get('/dashboard', verifyToken, renderDashboard);
router.post('/login', login);
router.get('/login', renderLogin);
router.get('/logout', logout);
router.post('/', register);
router.get('/', renderHome);

export default router;
