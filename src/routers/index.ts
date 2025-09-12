import { Router } from 'express';
import adminAuthRouter from './admin.auth.router';

const router = Router();

router.use('/admin/auth', adminAuthRouter);

export default router;