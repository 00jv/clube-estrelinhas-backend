import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/auth';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/login', authController.login);
authRoutes.post('/register', authController.register);
authRoutes.get('/me', authMiddleware, authController.me);
authRoutes.put('/profile', authMiddleware, (req, res) => authController.updateProfile(req, res));

export { authRoutes };
