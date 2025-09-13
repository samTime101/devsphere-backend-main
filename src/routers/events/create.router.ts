// SAMIP REGMI
// SEP 13 2025
// create.router.ts

// ROUTER IMPORT
import { Router } from 'express';
// CONTROLLER IMPORT
import createEventController from '@/controllers/events/create.controller';

// ROUTER INITIALIZATION
const createEventRouter = Router();

// SERVICE IMPORT

// ROUTE DEFINITION
createEventRouter.post('/create', createEventController.createEvent);



// EXPORTING THE ROUTER
export default createEventRouter;