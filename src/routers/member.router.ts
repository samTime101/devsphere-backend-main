import { memberController } from '@/controllers/member.controller';
import { createMemberSchema, updateMemberSchema } from '@/lib/zod/member.schema';
import { isModerator } from '@/middleware/auth.middleware';
import { validateData } from '@/middleware/validation.middleware';
import { router } from 'better-auth/api'
import { Router } from 'express'


const memberRouter = Router();

//Public routes
memberRouter.get('/',memberController.getMembers)

//Authenticated routes
memberRouter.use(isModerator)
memberRouter.post('/',validateData(createMemberSchema), memberController.createMember )
memberRouter.patch("/:id",validateData(updateMemberSchema) ,memberController.updateMember)


export default memberRouter;