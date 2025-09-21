import { projectController } from "@/controllers/project.controller";
import {
  createProjectSchema,
  updateProjectSchema,
  updateProjectParamsSchema,
} from "@/lib/zod/project.schema";
import { authMiddleware, isModerator } from "@/middleware/auth.middleware";
import { validateBody, validateParams } from "@/middleware/validation.middleware";
import { Router } from "express";

const projectRouter = Router();

projectRouter.use(authMiddleware);

projectRouter.get("/", projectController.getAllProjects);
projectRouter.post("/", validateBody(createProjectSchema), projectController.addProject);
projectRouter.patch(
  "/:id",
  validateParams(updateProjectParamsSchema),
  validateBody(updateProjectSchema),
  projectController.updateProject
);

export default projectRouter;
