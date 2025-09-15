import { memberController } from '@/controllers/member.controller';
import { router } from 'better-auth/api'
import { Router } from 'express'


const memberRouter = Router();
memberRouter.post('/createMember', memberController.createMember )

export default memberRouter;