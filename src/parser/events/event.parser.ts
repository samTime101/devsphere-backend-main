// SAMIP REGMI
// SEP 13 2025
// EVENT TYPE IMPORT
import type { Event as EventType } from '@/utils/types/event';

// ZOD SCHEMA IMPORT FOR PARSING AND VALIDATION
import { Event } from '@/utils/types/event';


// IF SUCCESS SEND [null, parsedData] 
// IF FAILURE SEND [errorMessage, null]
async function eventParser(data: Event): Promise<[string | null, EventType | null]> {
    // PARSING 
    const parsedEvent = Event.safeParse(data);
    // IF PARSING FAILS
    if (!parsedEvent.success) {
        return ['INVALID DATA FORMAT', null];
    }
    const eventData: EventType = parsedEvent.data;
    return [null, eventData];
}

export default eventParser;