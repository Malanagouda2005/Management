import { Router } from 'express';
import AuthController from '../controllers/authController';

const router = Router();

// Define routes
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

export default router;