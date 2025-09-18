import { memberController } from '@/controllers/member.controller';
import { createMemberSchema, updateMemberSchema } from '@/lib/zod/member.schema';
import { authMiddleware, isModerator } from '@/middleware/auth.middleware';
import { validateBody } from '@/middleware/validation.middleware';
import { router } from 'better-auth/api'
import { Router } from 'express'


const memberRouter = Router();

//Public routes
memberRouter.get('/',memberController.getMembers)

//Authenticated routes
memberRouter.use(authMiddleware)
memberRouter.use(isModerator)
memberRouter.post('/',validateBody(createMemberSchema), memberController.createMember )
memberRouter.patch("/:id",validateBody(updateMemberSchema) ,memberController.updateMember)


export default memberRouter;