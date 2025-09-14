// SAMIP REGMI
// SEP 13 2025
// create.controller.ts

import type { Request, Response } from "express";
// ERROR/SUCCESS RESPONSE IMPORT
import { ErrorResponse, SuccessResponse } from '@/dtos/index.js';

// SERVICE IMPORT
import createEventService from "@/services/event/create.service";
// STATUS CODE IMPORTS
import { HTTP } from '@/utils/constants';
// INTERFACE FOR REQUEST 

// EVENT TYPE
import type { Event } from '@/utils/types/event';

// EVENT PARSER
import eventParser from '@/parser/events/event.parser';

class CreateEventController {
    // CONTROLLER METHOD FOR CREATING EVENT
    async createEvent(req: Request, res: Response) {
        try {
            // PARSING AND VALIDATION
            const [parseError, eventData] : [string | null, Event | null] = await eventParser(req.body);
            // IF PARSING ERROR OCCURS
            if (parseError) {
                const errorResponse = new ErrorResponse({
                    error: parseError,
                    code: HTTP.BAD_REQUEST
                });
                return res.status(HTTP.BAD_REQUEST).json(errorResponse);
            }
            // AT THIS POINT **eventData** IS GUARANTEED TO BE NON-NULL DUE TO PARSER LOGIC
            // CALLING SERVICE TO CREATE EVENT
            const [serviceError, createdEvent]: [string | null, Event | null] = await createEventService(eventData as Event);
            // IF SERVICE RETURNS ERROR
            if (serviceError) {
                const errorResponse = new ErrorResponse({
                    error: serviceError,
                    code: HTTP.INTERNAL
                });
                return res.status(HTTP.INTERNAL).json(errorResponse);
            }
            // IF EVENT IS CREATED SUCCESSFULLY
            const successResponse = new SuccessResponse<Event>({
                data: createdEvent as Event,
                message: 'EVENT CREATED SUCCESSFULLY',
                code: HTTP.CREATED
            });
            return res.status(HTTP.CREATED).json(successResponse);
            // IF ANY UNEXPECTED ERROR OCCURS
        } catch (err) {
            const errorResponse = new ErrorResponse({
                error: 'INTERNAL SERVICE ERROR',
                code: HTTP.INTERNAL
            });
            return res.status(HTTP.INTERNAL).json(errorResponse);
        }
    }
}

// I HAVE CREATED AND EXPORTED, YOU CAN DIRECTLY EXPORT INSTANCE LIKE **AYUSH** IN `admin.auth.controller.ts`
const createEventController = new CreateEventController();
export default createEventController;