// SAMIP REGMI
// SEP 14 2025
// create.router.ts

// MODIFIED ON SEP 15
// ADDED GET EVENT CONTROLLER( SINGLE ID WALA ) SEP 15 2025

// ROUTER IMPORT
import { Router } from 'express';
// CONTROLLER IMPORT
import { eventController } from '@/controllers/event.controller';


// ROUTER INITIALIZATION
const eventRouter = Router();

// ROUTE DEFINITION
eventRouter.post('/create', eventController.createEvent);
eventRouter.get('/id/:id', eventController.getEvent);
eventRouter.get('/list', eventController.listEvent);
eventRouter.post('/update/:id', eventController.updateEvent);

// EXPORTING THE ROUTER
export default eventRouter; 