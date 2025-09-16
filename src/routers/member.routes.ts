import { memberController } from '@/controllers/member.controller';
import { isModerator } from '@/middleware/auth.middleware';
import { router } from 'better-auth/api'
import { Router } from 'express'


const memberRouter = Router();
memberRouter.post('/',isModerator, memberController.createMember )

memberRouter.delete('/:id',isModerator,memberController.removeMembers)

export default memberRouter;