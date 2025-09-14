// SAMIP REGMI
// SEP 14 2025

import createEventService from "@/services/event/create.service";
import type { Event } from '@/utils/types/event';

class EventService {
    // MAILE ERROR HANDLE GAREKO XAINA CALL MATRA GAREKO , UTAI FUNCTION DEFINITION MA HANDLE HUNXA
    async createEvent(data: Event) {
        return createEventService(data);
    }
}

export default new EventService();
