import { memberController } from '@/controllers/member.controller';
import { isModerator } from '@/middleware/auth.middleware';
import { router } from 'better-auth/api'
import { Router } from 'express'


const memberRouter = Router();

//Public routes
memberRouter.get('/',memberController.getMembers)

//Authenticated routes
memberRouter.use(isModerator)
memberRouter.post('/', memberController.createMember )
memberRouter.patch("/:id",memberController.updateMember)


export default memberRouter;