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
import type { Event as EventType } from '@/utils/types/event';

// ZOD SCHEMA IMPORT FOR PARSING AND VALIDATION
import { Event } from '@/utils/types/event';

class CreateEventController {
    // CONTROLLER METHOD FOR CREATING EVENT
    async createEvent(req: Request, res: Response) {
        try {
            // POST REQUEST IS SENT VIA BODY WITH FILEDS FROM **Event** INTERFACE
            const { title, description, status, EventSchedule }: Event = req.body;

            // IF NOT ALL FIELDS ARE GIVEN
            if (!title || !description || !status || !EventSchedule) {
                const errorResponse = new ErrorResponse({
                    error: 'ALL FIELDS ARE REQUIRED',
                    // I HAVE NOT KEPT **detail** FIELD , DEFAULT MA NULL JANXA HAI 
                    code: HTTP.BAD_REQUEST
                });
                return res.status(HTTP.BAD_REQUEST).json(errorResponse);
            }
            // PARSING 
            const parsedEvent = Event.safeParse(req.body);
            // IF PARSING FAILS
            if (!parsedEvent.success) {
                const errorResponse = new ErrorResponse({
                    error: 'INVALID DATA FORMAT',
                    code: HTTP.BAD_REQUEST
                });
                return res.status(HTTP.BAD_REQUEST).json(errorResponse);
            }
            const eventData: EventType = parsedEvent.data;

            // CALLING SERVICE TO CREATE EVENT
            const [error, result] = await createEventService(eventData);
            // IF ERROR OCCURS WHEN CREATING EVENT
            if (error) {
                const errorResponse = new ErrorResponse({
                    error,
                    code: HTTP.BAD_REQUEST
                });
                return res.status(HTTP.BAD_REQUEST).json(errorResponse);
            }
            
            // EVENT CREATE HUDA 
            const successResponse = new SuccessResponse({
                message: 'EVENT CREATION SUCCESS',
                data: result,
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