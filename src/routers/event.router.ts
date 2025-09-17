// SAMIP REGMI
// SEP 14 2025
// create.router.ts

// MODIFIED ON SEP 15
// ADDED GET EVENT CONTROLLER( SINGLE ID WALA ) SEP 15 2025

// ROUTER IMPORT
import { Router } from 'express';
// CONTROLLER IMPORT
import { eventController } from '@/controllers/event.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

// ROUTER INITIALIZATION
const eventRouter = Router();

// PUBLIC ROUTES
eventRouter.get('/',eventController.listEvent);
eventRouter.get('/:id',eventController.getEvent);

// PROTECTED ROUTES
eventRouter.use(authMiddleware);
eventRouter.post('/', eventController.createEvent);
eventRouter.patch('/:id',eventController.updateEvent);

// EXPORTING THE ROUTER
export default eventRouter; 