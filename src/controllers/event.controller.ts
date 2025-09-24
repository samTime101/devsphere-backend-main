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
import type { Event } from '@/lib/zod/event.schema';

class EventController {
    async createEvent(req: Request, res: Response) {
        try {
            const eventData : Event = (req.body)
            const result = await eventService.createEventService(eventData);
            // IF SERVICE RETURNS ERROR
            if (!result.success) {
                const errorResponse = ErrorResponse(
                    HTTP.INTERNAL,
                    result.error as string
                );
                return res.status(HTTP.INTERNAL).json(errorResponse);
            }
            // IF EVENT IS CREATED SUCCESSFULLY
            const successResponse =  SuccessResponse<Event>(
                HTTP.CREATED,
                'EVENT CREATED SUCCESSFULLY',
                result.data as Event,
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
            const result = await eventService.getEventService(eventId);

            // EVENT NOT FOUND UTA SERVICE BATA AAUXA
            if (!result.success) {
                const errorResponse =  ErrorResponse(
                    HTTP.NOT_FOUND,
                    result.error as string,
                );
                return res.status(errorResponse.code).json(errorResponse);
            }

            const successResponse =  SuccessResponse<Event>(
                HTTP.OK,
                'EVENT FETCHED SUCCESSFULLY',
                result.data as Event
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
            const result = await eventService.listEventService();
            // UTAI SERVICE BATAI ERROR AAUXA
            if (!result.success) {
                const errorResponse =  ErrorResponse(
                    HTTP.NOT_FOUND,
                    result.error as string,
                );
                return res.status(HTTP.NOT_FOUND).json(errorResponse);
            }
            // LIST MA LINE
            // THE RESPONSE WILL BE AN ARRAY OF EVENTS
            const successResponse =  SuccessResponse<Event[]>(
                HTTP.OK,
                'EVENTS FETCHED SUCCESSFULLY',
                result.data as Event[]
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
    async updateEvent(req: Request, res: Response) {
        try {
            const eventId = req.params.id;
            if (!eventId) {
                const errorResponse = ErrorResponse(
                    HTTP.BAD_REQUEST,
                    'EVENT ID IS REQUIRED'
                );
                return res.status(HTTP.BAD_REQUEST).json(errorResponse);
            }
            const eventData: Event = (req.body);
            // CALLING SERVICE TO UPDATE EVENT
            const result = await eventService.updateEventService(eventId, eventData as Event);
            // IF SERVICE RETURNS ERROR
            if (!result.success) {
                const errorResponse = ErrorResponse(
                    HTTP.INTERNAL,
                    result.error as string
                );
                return res.status(HTTP.INTERNAL).json(errorResponse);
            }
            // IF EVENT IS UPDATED SUCCESSFULLY
            const successResponse =  SuccessResponse<Event>(
                HTTP.OK,
                'EVENT UPDATED SUCCESSFULLY',
                result.data as Event,
            );
            return res.status(HTTP.OK).json(successResponse);
            // IF ANY UNEXPECTED ERROR OCCURS
        } catch (err) {
            const errorResponse = ErrorResponse(
                HTTP.INTERNAL,
                'INTERNAL SERVICE ERROR'
            );
            return res.status(HTTP.INTERNAL).json(errorResponse);
        }
    }
    // DELETE EVENT 
    // TAKES EVENT ID AS PARAM AND DELETES THE EVENT 
    // EVENTSCHEDULES ARE DELETED USING CASCADE DELETE
    async deleteEvent(req: Request, res: Response) {
        try {
            // PARAMS
            const eventId = req.params.id;
            if (!eventId) {
                const errorResponse = ErrorResponse(
                    HTTP.BAD_REQUEST,
                    'EVENT ID IS REQUIRED'
                );
                return res.status(HTTP.BAD_REQUEST).json(errorResponse);
            }
            const result = await eventService.deleteEventService(eventId);
            // EVENT NOT FOUND UTA SERVICE BATA AAUXA
            if (!result.success) {
                const errorResponse =  ErrorResponse(
                    HTTP.NOT_FOUND,
                    result.error as string,
                );
                return res.status(errorResponse.code).json(errorResponse);
            }

            const successResponse =  SuccessResponse<null>(
                HTTP.OK,
                'EVENT DELETED SUCCESSFULLY',
                null
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
