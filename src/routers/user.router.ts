import { Router } from "express";
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUserRole
} from "@/controllers/user.controller";
import { isAdmin } from "@/middleware/auth.middleware";
import { validateBody, validateParams, validateQuery } from "@/middleware/validation.middleware";
import {
    createUserSchema,
    updateUserRoleSchema,
    userParamsSchema,
    getUsersQuerySchema
} from "@/lib/zod/user.schema";

const router = Router();
router.use(isAdmin);
router.post(
    "/",
    validateBody(createUserSchema),
    createUser
);
router.get(
    "/",
    validateQuery(getUsersQuerySchema),
    getAllUsers
);

router.get(
    "/:id",
    validateParams(userParamsSchema),
    getUserById
);
router.patch(
    "/:id/role",
    validateParams(userParamsSchema),
    validateBody(updateUserRoleSchema),
    updateUserRole
);

export default router;
