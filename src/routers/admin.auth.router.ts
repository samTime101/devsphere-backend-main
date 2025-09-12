import { Router } from 'express';
import adminAuthController from '../controllers/admin.auth.controller';

const adminAuthRouter = Router();
adminAuthRouter.post('/login', adminAuthController.login);
adminAuthRouter.post('/logout', adminAuthController.logout);

export default adminAuthRouter;
