// SAMIP REGMI
// SEP 14 2025
// event.controller.ts

import createEventController from "./events/create.controller";

// REMOVEEVENT AND EDIT EVENT LEFT

class EventController {
    async createEvent(req: any, res: any) {
        return createEventController.createEvent(req, res);
    }
}

export default new EventController();
