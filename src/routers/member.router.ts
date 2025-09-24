import { memberController } from '@/controllers/member.controller';
import upload from '@/lib/multer';
import { createMemberSchema, getMembersQuerySchema, memberParamsSchema, updateMemberSchema } from '@/lib/zod/member.schema';
import { authMiddleware, isModerator } from '@/middleware/auth.middleware';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation.middleware';
import { Router } from 'express'


const memberRouter = Router();

//public routes
memberRouter.get('/',validateQuery(getMembersQuerySchema) ,memberController.getMembers)

//Authenticated routes
memberRouter.use(authMiddleware,isModerator)
memberRouter.post('/',upload.single("avatar") ,validateBody(createMemberSchema), memberController.createMember )
memberRouter.patch("/:id",upload.single("avatar"), validateParams(memberParamsSchema) ,validateBody(updateMemberSchema) ,memberController.updateMember)
memberRouter.get('/:id', validateParams(memberParamsSchema), memberController.getMember);


export default memberRouter;