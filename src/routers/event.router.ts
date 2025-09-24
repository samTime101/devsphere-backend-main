// SAMIP REGMI
// SEP 14 2025
// create.router.ts

// MODIFIED ON SEP 15
// ADDED GET EVENT CONTROLLER( SINGLE ID WALA ) SEP 15 2025


// REFERENCE FILE: https://github.com/samTime101/devsphere-backend-main/blob/develop/CONTRIBUTING.md#route-file-structure

// ROUTER IMPORT
import { Router } from 'express';
// CONTROLLER IMPORT
import { eventController } from '@/controllers/event.controller';
import { authMiddleware, isModerator } from '@/middleware/auth.middleware';
import {validateParams , validateBody } from "@/middleware/validation.middleware";
import { eventParamsSchema , eventSchema } from '@/lib/zod/event.schema';

// ROUTER INITIALIZATION
const eventRouter = Router();

// PUBLIC ROUTES
eventRouter.get('/',eventController.listEvent);
eventRouter.get('/:id',validateParams(eventParamsSchema),eventController.getEvent);

// PROTECTED ROUTES
eventRouter.use(authMiddleware, isModerator);
eventRouter.post('/', validateBody(eventSchema), eventController.createEvent);
eventRouter.patch('/:id', validateBody(eventSchema), validateParams(eventParamsSchema), eventController.updateEvent);
eventRouter.delete('/:id', validateParams(eventParamsSchema), eventController.deleteEvent);


// EXPORTING THE ROUTER
export default eventRouter; 