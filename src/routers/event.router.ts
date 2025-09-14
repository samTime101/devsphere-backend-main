// SAMIP REGMI
// SEP 14 2025
// create.router.ts

// ROUTER IMPORT
import { Router } from 'express';
// CONTROLLER IMPORT
import eventController from '@/controllers/event.controller';

// ROUTER INITIALIZATION
const eventRouter = Router();

// ROUTE DEFINITION
eventRouter.post('/create', eventController.createEvent);

// EXPORTING THE ROUTER
export default eventRouter;