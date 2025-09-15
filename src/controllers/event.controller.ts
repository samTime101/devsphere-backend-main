// SAMIP REGMI
// SEP 14 2025
// event.controller.ts

import type { Request, Response } from "express";
// ERROR/SUCCESS RESPONSE IMPORT
import { ErrorResponse, SuccessResponse } from '@/dtos/index.js';

// SERVICE IMPORT
import { eventService } from "@/services/event.service";
// STATUS CODE IMPORTS
import { HTTP } from '@/utils/constants';
// INTERFACE FOR REQUEST 

// EVENT TYPE
import type { Event } from '@/utils/types/event';

// EVENT PARSER
import eventParser from '@/parser/events/event.parser';


// REMOVEEVENT AND EDIT EVENT LEFT

class EventController {
    async createEvent(req: Request, res: Response) {
        try {
            // PARSING AND VALIDATION
            const [parseError, eventData] : [string | null, Event | null] = await eventParser(req.body);
            // IF PARSING ERROR OCCURS
            if (parseError) {
                const errorResponse = ErrorResponse(
                    HTTP.BAD_REQUEST,
                    parseError
                );
                return res.status(HTTP.BAD_REQUEST).json(errorResponse);
            }
            // AT THIS POINT **eventData** IS GUARANTEED TO BE NON-NULL DUE TO PARSER LOGIC
            // CALLING SERVICE TO CREATE EVENT
            const [serviceError, createdEvent]: [string | null, Event | null] = await eventService.createEventService(eventData as Event);
            // IF SERVICE RETURNS ERROR
            if (serviceError) {
                const errorResponse = ErrorResponse(
                    HTTP.INTERNAL,
                    serviceError
                );
                return res.status(HTTP.INTERNAL).json(errorResponse);
            }
            // IF EVENT IS CREATED SUCCESSFULLY
            const successResponse =  SuccessResponse<Event>(
                HTTP.CREATED,
                'EVENT CREATED SUCCESSFULLY',
                createdEvent as Event,
            );
            return res.status(HTTP.CREATED).json(successResponse);
            // IF ANY UNEXPECTED ERROR OCCURS
        } catch (err) {
            const errorResponse = ErrorResponse(
                HTTP.INTERNAL,
                'INTERNAL SERVICE ERROR'
            );
            return res.status(HTTP.INTERNAL).json(errorResponse);
        }
    }
        async getEvent(req: Request, res: Response) {
        try {
            const eventId = req.params.id;
            if (!eventId) {
                const errorResponse = ErrorResponse(
                    HTTP.BAD_REQUEST,
                    'EVENT ID IS REQUIRED'
                );
                return res.status(HTTP.BAD_REQUEST).json(errorResponse);
            }
            const [error, event]: [string | null, Event | null] = await eventService.getEventService(eventId);

            // EVENT NOT FOUND UTA SERVICE BATA AAUXA
            if (error) {
                const errorResponse =  ErrorResponse(
                    HTTP.NOT_FOUND,
                    error,
                );
                return res.status(errorResponse.code).json(errorResponse);
            }

            const successResponse =  SuccessResponse<Event>(
                HTTP.OK,
                'EVENT FETCHED SUCCESSFULLY',
                event as Event
            );
            return res.status(HTTP.OK).json(successResponse);
        } catch (error) {
            const errorResponse =  ErrorResponse(
                HTTP.INTERNAL,
                'INTERNAL SERVER ERROR',
            );
            return res.status(HTTP.INTERNAL).json(errorResponse);
        }
    }
        async listEvent(req: Request, res: Response) {
        try {
            const [error, events]: [string | null, Event[] | null] = await eventService.listEventService();
            // UTAI SERVICE BATAI ERROR AAUXA
            if (error) {
                const errorResponse =  ErrorResponse(
                    HTTP.NOT_FOUND,
                    error,
                );
                return res.status(HTTP.NOT_FOUND).json(errorResponse);
            }
            // LIST MA LINE
            // THE RESPONSE WILL BE AN ARRAY OF EVENTS
            const successResponse =  SuccessResponse<Event[]>(
                HTTP.OK,
                'EVENTS FETCHED SUCCESSFULLY',
                events as Event[]
            );
            return res.status(HTTP.OK).json(successResponse);
        } catch (error) {
            const errorResponse =  ErrorResponse(
                HTTP.INTERNAL,
                'INTERNAL SERVER ERROR',
            );
            return res.status(HTTP.INTERNAL).json(errorResponse);
        }
    }
}

export const eventController = new EventController();
