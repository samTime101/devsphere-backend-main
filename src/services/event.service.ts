// SAMIP REGMI
// SEP 14 2025
import { prismaSafe } from '@/lib/prismaSafe.ts';
import prisma from '@/db/prisma.js';


// INTERFACE IMPORT
import type { Event, EventSchedule } from '@/lib/zod/event.schema';

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
            id: dbEvent.id,
            name: dbEvent.name,
            description: dbEvent.description,
            status: dbEvent.status,
            // MANUAL MAPPING INSTEAD OF JUST SENDING THE DB OBJECT
            eventSchedule: dbEvent.EventSchedule.map((schedule: EventSchedule) => ({
                id: schedule.id,
                // eventId: schedule.eventId, -> DB MA XA TARA EVENT ZOD SCHEMA MA XAINA
                startDate: schedule.startDate,
                endDate: schedule.endDate,
                description: schedule.description,
            })),
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
            eventSchedule: dbEvent.EventSchedule.map((schedule: EventSchedule) => ({
                id: schedule.id,
                startDate: schedule.startDate,
                endDate: schedule.endDate,
                description: schedule.description,
            })),
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
            eventSchedule: event.EventSchedule.map((schedule: EventSchedule) => ({
                id: schedule.id,
                startDate: schedule.startDate,
                endDate: schedule.endDate,
                description: schedule.description,
            })),
        }));

        return { success: true, data: fetchedEvents };
    } catch (error) {
        return { success: false, error: 'FAILED TO FETCH EVENT' };
    }
}
    async updateEventService(eventId: string, eventData: Partial<Event>): Promise<{ success: boolean; error?: string; data?: Event }> {
        try{
            // WHEN UPDATING EVENT WITH EVENT SCHEDULE, 
            // FIRST DELETE ALL THE EXISTING SCHEDULES AND EVENTS AND THEN ADD CURRENT DATA
            // YESO GARDA SAJILO HUNXA
            const [dbError, dbEvent] = await prismaSafe(
                prisma.events.update({
                    where: { id: eventId },
                    data: {
                        name: eventData.name,
                        description: eventData.description,
                        status: eventData.status,
                        EventSchedule: { 
                            deleteMany: {} , // DELETE ALL EXISTING SCHEDULES
                            create: eventData.eventSchedule // ADD NEW SCHEDULES
                        }
                    },
                    include: { EventSchedule: true },
                })
            );
            // IF DB ERROR OCCURS
            if (dbError) {
                return { success: false, error: dbError };
            }
            if (!dbEvent) {
                return { success: false, error: 'EVENT NOT FOUND OR NOT UPDATED' };
            }


            // ALSO MALAI YO EVENT SCHEDULE MA eventId AAKO THIK LAGEKO XAINA
            // THIS IS HAPPENING BECAUSE OF PRISMA SCHEMA 

            // MAPPING DB EVENT TO EVENT TYPE
            const updatedEvent: Event = {
                name: dbEvent.name,
                description: dbEvent.description,
                status: dbEvent.status,
                eventSchedule: dbEvent.EventSchedule.map((schedule: EventSchedule) => ({
                    id: schedule.id,
                    startDate: schedule.startDate,
                    endDate: schedule.endDate,
                    description: schedule.description,
                })),
            };
            return { success: true, data: updatedEvent };
        } catch (error) {
            return { success: false, error: 'FAILED TO UPDATE EVENT' };
        }
    }
    // SEP 18 2025
    // DELETE EVENT SERVICE
    async deleteEventService(eventId: string): Promise<{ success: boolean; error?: string }> {
        try {
            const [dbError, dbEvent] = await prismaSafe(
                prisma.events.delete({
                    where: { id: eventId },
                })
            );
            // IF DB ERROR OCCURS
            if (dbError) {
                return { success: false, error: dbError };
            }
            if (!dbEvent) {
                return { success: false, error: 'EVENT NOT FOUND OR NOT DELETED' };
            }
            return { success: true };
        } catch (error) {
            return { success: false, error: 'FAILED TO DELETE EVENT' };
        }
    }
}
export const eventService = new EventService();