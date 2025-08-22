import { Router } from 'express';
import { register, login, logout } from '../controllers/authControllers';
import { isAuthenticated } from '../middlewares/auth';

const authRouter = Router();

// Register route
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', isAuthenticated, logout);

export default authRouter;
