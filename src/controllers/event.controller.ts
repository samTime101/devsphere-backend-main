/**
 * @file        event.controller.ts
 * @fileOverview Controller for event-related operations
 * @author      Samip Regmi (samTime101)
 * @date        2025-09-14
 * @since       2025-09-27
 * @requires    express
 * @requires    eventService
 * @requires    ErrorResponse
 * @requires    SuccessResponse
 * @requires    HTTP
 * @requires    Event
 * @requires    Request
 * @requires    Response
 */

import type { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "@/dtos/index.js";
import { eventService } from "@/services/event.service";
import { HTTP } from "@/utils/constants";
import type { Event  } from "@/lib/zod/event.schema";


/**
 * @class EventController
 * @classdesc Controller class for handling event-related operations
 */

class EventController {
  /**
   * @method createEvent
   * @description Creates a new event with the provided data and images
   * @param {Request} req - Express request object containing event data and image files
   * @param {Response} res - Express response object for sending responses
   * @returns {Promise<Response>} - JSON response indicating success or failure of event creation
   */
  async createEvent(req: Request, res: Response) {
    try {
      // aaile chai we are sending multipart form data so we have to parse the json data from the form data
      const eventData: Event = req.body.eventData;
      const imageFiles = req.files as Express.Multer.File[];
      const result = await eventService.createEventService(
        eventData as Event,
        imageFiles as Express.Multer.File[],
      );
      // IF SERVICE RETURNS ERROR
      if (!result.success) {
        const errorResponse = ErrorResponse(
          HTTP.INTERNAL,
          result.error as string
        );
        return res.status(HTTP.INTERNAL).json(errorResponse);
      }
      // IF EVENT IS CREATED SUCCESSFULLY
      const successResponse = SuccessResponse<Event>(
        HTTP.CREATED,
        "EVENT CREATED SUCCESSFULLY",
        result.data as Event
      );
      return res.status(HTTP.CREATED).json(successResponse);
      // IF ANY UNEXPECTED ERROR OCCURS
    } catch (err) {
      console.log("ERROR IN EVENT CONTROLLER:", err);
      const errorResponse = ErrorResponse(
        HTTP.INTERNAL,
        "INTERNAL SERVICE ERROR"
      );
      return res.status(HTTP.INTERNAL).json(errorResponse);
    }
  }
  /**
   * @method getEvent
   * @description Fetches an event by its ID
   * @param {Request} req - Express request object containing event ID in params
   * @param {Response} res - Express response object for sending responses
   * @returns {Promise<Response>} - JSON response containing the event data or an error message
   */
  async getEvent(req: Request, res: Response) {
    try {
      const eventId = req.params.id;
      if (!eventId) {
        const errorResponse = ErrorResponse(
          HTTP.BAD_REQUEST,
          "EVENT ID IS REQUIRED"
        );
        return res.status(HTTP.BAD_REQUEST).json(errorResponse);
      }
      const result = await eventService.getEventService(eventId);

      // EVENT NOT FOUND UTA SERVICE BATA AAUXA
      if (!result.success) {
        const errorResponse = ErrorResponse(
          HTTP.NOT_FOUND,
          result.error as string
        );
        return res.status(errorResponse.code).json(errorResponse);
      }

      const successResponse = SuccessResponse<Event>(
        HTTP.OK,
        "EVENT FETCHED SUCCESSFULLY",
        result.data as Event
      );
      return res.status(HTTP.OK).json(successResponse);
    } catch (error) {
      const errorResponse = ErrorResponse(
        HTTP.INTERNAL,
        "INTERNAL SERVER ERROR"
      );
      return res.status(HTTP.INTERNAL).json(errorResponse);
    }
  }
  /**
   * @method listEvent
   * @description Fetches all events
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object for sending responses
   * @returns {Promise<Response>} - JSON response containing the list of events or an error message
   */
  async listEvent(req: Request, res: Response) {
    try {
      const result = await eventService.listEventService();
      // UTAI SERVICE BATAI ERROR AAUXA
      if (!result.success) {
        const errorResponse = ErrorResponse(
          HTTP.NOT_FOUND,
          result.error as string
        );
        return res.status(HTTP.NOT_FOUND).json(errorResponse);
      }
      // LIST MA LINE
      // THE RESPONSE WILL BE AN ARRAY OF EVENTS
      const successResponse = SuccessResponse<Event[]>(
        HTTP.OK,
        "EVENTS FETCHED SUCCESSFULLY",
        result.data as Event[]
      );
      return res.status(HTTP.OK).json(successResponse);
    } catch (error) {
      const errorResponse = ErrorResponse(
        HTTP.INTERNAL,
        "INTERNAL SERVER ERROR"
      );
      return res.status(HTTP.INTERNAL).json(errorResponse);
    }
  }
  /**
   * @method updateEvent
   * @description Updates an existing event with the provided data
   * @param {Request} req - Express request object containing event ID in params and updated event data in body
   * @param {Response} res - Express response object for sending responses
   * @returns {Promise<Response>} - JSON response indicating success or failure of event update
   */
  async updateEvent(req: Request, res: Response) {
    try {
      const eventId = req.params.id;
      if (!eventId) {
        const errorResponse = ErrorResponse(
          HTTP.BAD_REQUEST,
          "EVENT ID IS REQUIRED"
        );
        return res.status(HTTP.BAD_REQUEST).json(errorResponse);
      }
      const eventData: Event = req.body.eventData;
      const imageFiles = req.files as Express.Multer.File[] | undefined;

      console.log("EVENT DATA IN CONTROLLER:", eventData);

      // VALIDATION SHOULD HAVE BEEN DONE IN THE MIDDLEWARE
      // CALLING SERVICE TO UPDATE EVENT
      const result = await eventService.updateEventService(
        eventId,
        eventData as Event,
        imageFiles as Express.Multer.File[] | undefined
      );
      // IF SERVICE RETURNS ERROR
      if (!result.success) {
        const errorResponse = ErrorResponse(
          HTTP.INTERNAL,
          result.error as string
        );
        return res.status(HTTP.INTERNAL).json(errorResponse);
      }
      // IF EVENT IS UPDATED SUCCESSFULLY
      const successResponse = SuccessResponse<Event>(
        HTTP.OK,
        "EVENT UPDATED SUCCESSFULLY",
        result.data as Event
      );
      return res.status(HTTP.OK).json(successResponse);
      // IF ANY UNEXPECTED ERROR OCCURS
    } catch (err) {
      const errorResponse = ErrorResponse(
        HTTP.INTERNAL,
        "INTERNAL SERVICE ERROR"
      );
      return res.status(HTTP.INTERNAL).json(errorResponse);
    }
  }
  async deleteEvent(req: Request, res: Response) {
    /**
     * @method deleteEvent
     * @description Deletes an event by its ID
     * @param {Request} req - Express request object containing event ID in params
     * @param {Response} res - Express response object for sending responses
     * @returns {Promise<Response>} - JSON response indicating success or failure of event deletion
     */
    try {
      // PARAMS
      const eventId = req.params.id;
      if (!eventId) {
        const errorResponse = ErrorResponse(
          HTTP.BAD_REQUEST,
          "EVENT ID IS REQUIRED"
        );
        return res.status(HTTP.BAD_REQUEST).json(errorResponse);
      }
      const result = await eventService.deleteEventService(eventId);
      // EVENT NOT FOUND UTA SERVICE BATA AAUXA
      if (!result.success) {
        const errorResponse = ErrorResponse(
          HTTP.NOT_FOUND,
          result.error as string
        );
        return res.status(errorResponse.code).json(errorResponse);
      }

      const successResponse = SuccessResponse<null>(
        HTTP.OK,
        "EVENT DELETED SUCCESSFULLY",
        null
      );
      return res.status(HTTP.OK).json(successResponse);
    } catch (error) {
      const errorResponse = ErrorResponse(
        HTTP.INTERNAL,
        "INTERNAL SERVER ERROR"
      );
      return res.status(HTTP.INTERNAL).json(errorResponse);
    }
  }
}

export const eventController = new EventController();