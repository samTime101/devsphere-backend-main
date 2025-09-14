// SAMIP REGMI
// SEP 14 2025
// event.controller.ts

import createEventController from "@/controllers/events/create.controller";
import type { Request, Response } from "express";

// REMOVEEVENT AND EDIT EVENT LEFT

class EventController {
    async createEvent(req: Request, res: Response) {
        return createEventController.createEvent(req, res);
    }
}

export default new EventController();
