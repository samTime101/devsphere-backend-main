// SAMIP REGMI
// SEP 14 2025

import { prismaSafe } from '@/lib/prismaSafe';
import prisma from '@/db/prisma';
import type { Event } from '@/utils/types/event';

class EventServices {
    async createEvent(eventData: Event): Promise<{ success: boolean; error?: string; data?: Event }> {
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
                return { success: false, error: 'DATABASE ERROR OCCURRED' };
            }

            if (!dbEvent) {
                return { success: false, error: 'Failed to create event' };
            }

            const createdEvent: Event = {
                ...eventData,
            };
            // RETURN SUCCESS WITH EVENT DATA
            return { success: true, data: createdEvent };
        } catch (error) {
            console.log(`Failed to create event, ${error}`);
            return { success: false, error: 'FAILED TO CREATE EVENT' };
        }
    }
}

export const eventServices = new EventServices();
