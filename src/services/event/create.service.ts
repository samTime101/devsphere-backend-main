// SAMIP REGMI
// SEP 13 2025
// create.service.ts

// **TODO**-> IMPLEMENT DB INTEGRATION

import { prismaSafe } from '@/lib/prismaSafe.ts';
import prisma from '@/db/prisma.js';


// INTERFACE IMPORT
import type { Event } from '@/utils/types/event';

// RETURNS [error, createdEvent]

// **error** -> IS NULL IF EVENT IS CREATED SUCCESSFULLY
// **createdEvent** -> EVENT OBJECT IS RETURNED IF EVENT CREATION IS SUCCESSFUL ELSE NULL

async function createEventService(eventData: Event): Promise<[string | null, Event | null]> {
    try {
        // SEND TO DB
        const [dbError, dbEvent] = await prismaSafe(
            prisma.events.create({
                data: {
                    name: eventData.name,
                    description: eventData.description,
                    status: eventData.status,
                    EventSchedule: { create: eventData.eventSchedule },
                },
            })
        );
        // IF DB ERROR OCCURS
        if (dbError) {
            return ['DATABASE ERROR OCCURRED', null];
        }
        const createdEvent: Event = {
            ...eventData,
        };
        // ONLY SEND EVENT CREATION DATA !DONT SEND ERROR MESSAGE SEND NULL INSTEAD
        return [null, createdEvent];
    } catch (error) {
        // ONLY SEND ERROR MESSAGE AND NULL EVENT OBJECT
        return ['FAILED TO CREATE EVENT', null];
    }
}

export default createEventService;