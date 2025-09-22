import { contributorController } from "@/controllers/contributor.controller";
import { Router } from "express";

const contributorRouter = Router();

contributorRouter.get("/", contributorController.getContributors);

export default contributorRouter;
