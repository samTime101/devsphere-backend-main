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
import { authMiddleware, isAdmin } from '@/middleware/auth.middleware';

// ROUTER INITIALIZATION
const eventRouter = Router();

// PUBLIC ROUTES
eventRouter.get('/',eventController.listEvent);
eventRouter.get('/:id',eventController.getEvent);

// PROTECTED ROUTES
eventRouter.use(authMiddleware);
eventRouter.post('/', eventController.createEvent);
eventRouter.patch('/:id',eventController.updateEvent);

// ADMIN ROUTES
eventRouter.delete('/:id', isAdmin, eventController.deleteEvent);


// EXPORTING THE ROUTER
export default eventRouter; 