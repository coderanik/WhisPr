import { Router } from 'express';
import { register, login, logout } from '../controllers/authControllers';
import { isAuthenticated } from '../middlewares/auth';
import { validateRegistration, validateLogin } from '../utils/validation';

const authRouter = Router();

// Register route
authRouter.post('/register', validateRegistration, register);
authRouter.post('/login', validateLogin, login);
authRouter.post('/logout', isAuthenticated, logout);

export default authRouter;
