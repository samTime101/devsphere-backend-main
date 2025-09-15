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
    async createEventService(eventData: Event): Promise<[string | null, Event | null]> {
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
async getEventService(eventId: string): Promise<[string | null, Event | null]> {
    try {
        const [dbError, dbEvent] = await prismaSafe(
            prisma.events.findUnique({
                where: { id: eventId },
                include: { EventSchedule: true },
            })
        );
        // IF DB ERROR OCCURS
        if (dbError) {
            return ['DATABASE ERROR OCCURRED', null];
        }
        if (!dbEvent) {
            return ['EVENT NOT FOUND', null];
        }
        // MAPPING DB EVENT TO EVENT TYPE
        const fetchedEvent: Event = {
            name: dbEvent.name,
            description: dbEvent.description,
            status: dbEvent.status,
            eventSchedule: dbEvent.EventSchedule,
        };
        return [null, fetchedEvent];
    } catch (error) {
        return ['FAILED TO FETCH EVENT', null];
    }
}
async listEventService(): Promise<[string | null, Event[] | null]> {
    try {
        const [dbError, dbEvents] = await prismaSafe(
            prisma.events.findMany({
                include: { EventSchedule: true },
            })
        );
        // IF DB ERROR OCCURS
        if (dbError) {
            return ['DATABASE ERROR OCCURRED', null];
        }
        if (!dbEvents) {
            return ['EVENT NOT FOUND', null];
        }
        // MAPPING DB EVENT TO EVENT TYPE
        const fetchedEvents: Event[] = dbEvents.map(event => ({
            id: event.id,
            name: event.name,
            description: event.description,
            status: event.status,
            eventSchedule: event.EventSchedule,
        }));

        return [null, fetchedEvents];
    } catch (error) {
        return ['FAILED TO FETCH EVENT', null];
    }
}
}

export const eventService = new EventService();