import { tagController } from "@/controllers/tag.controller";
import { authMiddleware, isModerator } from "@/middleware/auth.middleware";
import { Router } from "express";

const tagRouter = Router();

tagRouter.use(authMiddleware, isModerator);

tagRouter.get("/", tagController.getAllTags);
tagRouter.get("/:id", tagController.getTagById);
tagRouter.post("/", tagController.createTag);
tagRouter.patch("/:id", tagController.updateTag);
tagRouter.delete("/:id", tagController.deleteTag);
export default tagRouter;
