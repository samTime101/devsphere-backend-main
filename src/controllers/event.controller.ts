// SAMIP REGMI
// SEP 14 2025
// event.controller.ts

import type { Request, Response } from "express";
// ERROR/SUCCESS RESPONSE IMPORT
import { ErrorResponse, SuccessResponse } from '@/dtos/index.js';

// SERVICE IMPORT
import { eventServices } from "@/services/event.service";
// STATUS CODE IMPORTS
import { HTTP } from '@/utils/constants';

// EVENT TYPE
import type { Event } from '@/utils/types/event';

// EVENT PARSER
import eventParser from '@/parser/events/event.parser';

class EventController {
    // CONTROLLER METHOD FOR CREATING EVENT
    async createEvent(req: Request, res: Response) {
        try {
            // PARSING AND VALIDATION
            const parseResult = await eventParser(req.body);
            // IF PARSING ERROR OCCURS
            if (!parseResult.success) {
                return res.status(HTTP.BAD_REQUEST).json(ErrorResponse(HTTP.BAD_REQUEST, parseResult.error || 'Invalid event data'));
            }
            // AT THIS POINT **eventData** IS GUARANTEED TO BE NON-NULL DUE TO PARSER LOGIC
            // CALLING SERVICE TO CREATE EVENT
            const serviceResult = await eventServices.createEvent(parseResult.data as Event);
            // IF SERVICE RETURNS ERROR
            if (!serviceResult.success) {
                return res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, serviceResult.error || 'Failed to create event'));
            }
            // IF EVENT IS CREATED SUCCESSFULLY
            return res.status(HTTP.CREATED).json(SuccessResponse(HTTP.CREATED, 'EVENT CREATED SUCCESSFULLY', serviceResult.data as Event));
            // IF ANY UNEXPECTED ERROR OCCURS
        } catch (err) {
            return res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, 'INTERNAL SERVICE ERROR'));
        }
    }
}

export const eventController = new EventController();
