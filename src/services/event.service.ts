// SAMIP REGMI
// SEP 14 2025
import { prismaSafe } from '@/lib/prismaSafe.ts';
import prisma from '@/db/prisma.js';


// INTERFACE IMPORT
import type { Event } from '@/utils/types/event';

// RETURNS [error, createdEvent]

// **error** -> IS NULL IF EVENT IS CREATED SUCCESSFULLY
// **createdEvent** -> EVENT OBJECT IS RETURNED IF EVENT CREATION IS SUCCESSFUL ELSE NULL


class EventService {
    async createEventService(eventData: Event): Promise<{success: boolean; error?: string; data?: Event}> {
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
                include: { EventSchedule: true },
            })
        );
        // IF DB ERROR OCCURS
        if (dbError) {
            return { success: false, error: dbError};
        }
        if (!dbEvent) {
            return { success: false, error: 'EVENT NOT CREATED' };
        }
        // FIXED: INSTEAD OF DUMMY RETURN , RETURN ACTUAL CREATED EVENT
        // MAPPING DB EVENT TO EVENT TYPE
        const createdEvent: Event = {
            name: dbEvent.name,
            description: dbEvent.description,
            status: dbEvent.status,
            eventSchedule: dbEvent.EventSchedule,
        };
        // ONLY SEND EVENT CREATION DATA !DONT SEND ERROR MESSAGE SEND NULL INSTEAD
        return { success: true, data: createdEvent };
    } catch (error) {
        // ONLY SEND ERROR MESSAGE AND NULL EVENT OBJECT
        return { success: false, error: error as string};
    }
}
async getEventService(eventId: string): Promise<{ success: boolean; error?: string; data?: Event }> {
    try {
        const [dbError, dbEvent] = await prismaSafe(
            prisma.events.findUnique({
                where: { id: eventId },
                include: { EventSchedule: true },
            })
        );
        // IF DB ERROR OCCURS
        if (dbError) {
            return { success: false, error: dbError };
        }
        if (!dbEvent) {
            return { success: false, error: 'EVENT NOT FOUND' };
        }
        // MAPPING DB EVENT TO EVENT TYPE
        const fetchedEvent: Event = {
            name: dbEvent.name,
            description: dbEvent.description,
            status: dbEvent.status,
            eventSchedule: dbEvent.EventSchedule,
        };
        return { success: true, data: fetchedEvent };
    } catch (error) {
        return { success: false, error: 'FAILED TO FETCH EVENT' };
    }
}
async listEventService(): Promise<{ success: boolean; error?: string; data?: Event[] }> {
    try {
        const [dbError, dbEvents] = await prismaSafe(
            prisma.events.findMany({
                include: { EventSchedule: true },
            })
        );
        // IF DB ERROR OCCURS
        if (dbError) {
            return { success: false, error: 'DATABASE ERROR OCCURRED' };
        }
        if (!dbEvents) {
            return { success: false, error: 'EVENT NOT FOUND' };
        }
        // MAPPING DB EVENT TO EVENT TYPE
        const fetchedEvents: Event[] = dbEvents.map(event => ({
            id: event.id,
            name: event.name,
            description: event.description,
            status: event.status,
            eventSchedule: event.EventSchedule,
        }));

        return { success: true, data: fetchedEvents };
    } catch (error) {
        return { success: false, error: 'FAILED TO FETCH EVENT' };
    }
}
}

export const eventService = new EventService();