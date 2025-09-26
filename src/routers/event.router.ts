/**
 * @file event.router.ts
 * @fileOverview Router for event-related endpoints
 * @author Samip Regmi (samTime101)
 * @date    2025-09-14
 * @since   2025-09-26
 * @see {@link https://github.com/samTime101/devsphere-backend-main/blob/develop/CONTRIBUTING.md#route-file-structure}
 * @requires express
 * @requires eventController
 * @requires authMiddleware
 * @requires isModerator
 * @requires validateParams
 * @requires validateBody
 * @requires eventParamsSchema
 * @requires eventSchema
 * @requires upload
 */

import { Router } from "express";
import { eventController } from "@/controllers/event.controller";
import { authMiddleware, isModerator } from "@/middleware/auth.middleware";
import {
  validateParams,
  validateFormData
} from "@/middleware/validation.middleware";
import { eventParamsSchema, eventSchema} from "@/lib/zod/event.schema";
import upload from "@/lib/multer";

// ROUTER INITIALIZATION
const eventRouter = Router();

// PUBLIC ROUTES
eventRouter.get("/", eventController.listEvent);
eventRouter.get(
  "/:id",
  validateParams(eventParamsSchema),
  eventController.getEvent
);

// PROTECTED ROUTES
eventRouter.use(authMiddleware, isModerator);

eventRouter.post(
  "/",
  upload.array("imageFiles"),
  validateFormData(eventSchema),
  eventController.createEvent
);
eventRouter.patch(
  "/:id",
//   validateBody(eventSchema),
  validateParams(eventParamsSchema),
  eventController.updateEvent
);
eventRouter.delete(
  "/:id",
  validateParams(eventParamsSchema),
  eventController.deleteEvent
);

// EXPORTING THE ROUTER
export default eventRouter;