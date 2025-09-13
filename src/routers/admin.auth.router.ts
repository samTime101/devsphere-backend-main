import { Router } from 'express';
import adminAuthController from '../controllers/admin.auth.controller.js';

const adminAuthRouter = Router();
adminAuthRouter.post('/signup', adminAuthController.signup);

export default adminAuthRouter;
