import { memberController } from '@/controllers/member.controller';
import { isModerator } from '@/middleware/auth.middleware';
import { router } from 'better-auth/api'
import { Router } from 'express'


const memberRouter = Router();
memberRouter.post('/',isModerator, memberController.createMember )
memberRouter.patch("/:id",isModerator,memberController.updateMember)

memberRouter.get('/',memberController.getMembers)
export default memberRouter;