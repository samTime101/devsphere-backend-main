// SAMIP REGMI
// SEP 13 2025
// EVENT TYPE IMPORT
import type { Event } from '@/utils/types/event';

// ZOD SCHEMA IMPORT FOR PARSING AND VALIDATION
import { eventSchema } from '@/utils/types/event';


// IF SUCCESS SEND [null, parsedData] 
// IF FAILURE SEND [errorMessage, null]
async function eventParser(data: Event): Promise<[string | null, Event | null]> {
    // PARSING 
    const parsedEvent = eventSchema.safeParse(data);
    // IF PARSING FAILS
    if (!parsedEvent.success) {
        return ['INVALID DATA FORMAT', null];
    }
    const eventData: Event = parsedEvent.data;
    return [null, eventData];
}

export default eventParser;