/**
 * @file        event.service.ts
 * @fileoverview Service layer for managing events, including creation, retrieval, updating, and deletion
 * @author      Samip Regmi (samTime101)
 * @date        2025-09-14
 * @since       2025-09-26
 * @module      services/event.service
 * @requires    prismaSafe
 * @requires    prisma
 * @requires    Event
 * @requires    EventSchedule
 * @requires    EventImageType
 * @requires    EventImage
 * @requires    uploadImageToCloudinary
 */

import { prismaSafe } from "@/lib/prismaSafe.ts";
import prisma from "@/db/prisma.js";
import type {
  Event,
  EventSchedule,
  EventImage,
} from "@/lib/zod/event.schema";
import { uploadImageToCloudinary } from "@/utils/cloudinary.uploader.ts";

/**
 * @function uploadEventImage
 * @description Uploads event images to Cloudinary and returns their URLs along with their types
 * @param {Express.Multer.File[]} imageFiles - The image files to upload
 * @param {Event} event - The event data containing image types
 * @returns {Promise<EventImage[]>} - A promise that resolves to an array of uploaded event images with their URLs and types
 * @throws Will throw an error if image upload fails
 */

const uploadEventImages = async (
  event: Event,
  imageFiles: Express.Multer.File[]
): Promise<EventImage[]> => {
    // console.log(event.status)
    // event ko id ta event db ma save vaye paxi aauxa and this shit is before pusing event data to db
    // that means we cant access id of event before it is pushed to db 
    // name is only option , cant think of other as of now
  
    console.log(event)
  console.log("UPLOADING IMAGES TO CLOUDINARY FOLDER PATH: ", `events/${event.name}/${event.images?.map((image) => image.imageType).join("/")}`);

  const uploadResults = await Promise.all(
    imageFiles.map((file) =>
      uploadImageToCloudinary(file.path, { folder: `events/${event.name}/${event.images?.map((image) => image.imageType).join("/")}` })
    )
  );

  return uploadResults.map((result, index) => ({
    imageUrl: result.url!,
    imageType: event.images![index].imageType,
  }));
};

/**
 * @class EventService
 * @classdesc Service class for managing event-related operations
 */

class EventService {
  async createEventService(
    eventData: Event,
    imageFiles: Express.Multer.File[],
  ): Promise<{ success: boolean; error?: string; data?: Event }> {
    /**
     * @method createEventService
     * @description Uploads event images to Cloudinary and creates a new event in the database
     * @param {Event} eventData - The event data to create
     * @param {Express.Multer.File[]} imageFiles - The image files to upload
     * @returns A promise that resolves to an object containing success status, error message (if any), and the created event data (if successful)
     * @throws Will throw an error if image upload or database operation fails.
     */
    try {
      if (imageFiles && imageFiles.length > 0) {
        console.log("UPLOADING IMAGES TO CLOUDINARY");
        const uploadResults = await uploadEventImages(
          eventData as Event,
          imageFiles as Express.Multer.File[],
        );
        // jamma duita property set hunxa imageUrl ra imageType
        eventData.images = uploadResults;
      }
    } catch (error) {
      console.log(`CLOUDINARY UPLOAD ERROR: ${error}`);
    }
    try {
      const [dbError, dbEvent] = await prismaSafe(
        prisma.events.create({
          data: {
            name: eventData.name,
            description: eventData.description,
            status: eventData.status,
            EventSchedule: { create: eventData.eventSchedule },
            EventImage: { create: eventData.images },
          },
          include: { EventSchedule: true, EventImage: true },
        })
      );
      // IF DB ERROR OCCURS
      if (dbError) {
        return { success: false, error: dbError };
      }
      if (!dbEvent) {
        return { success: false, error: "EVENT NOT CREATED" };
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
        images: dbEvent.EventImage.map((image) => ({
          id: image.id,
          imageUrl: image.imageUrl ?? undefined,
          imageType: image.imageType,
        })),  
        };
      // ONLY SEND EVENT CREATION DATA !DONT SEND ERROR MESSAGE SEND NULL INSTEAD
      return { success: true, data: createdEvent };
    } catch (error) {
      // ONLY SEND ERROR MESSAGE AND NULL EVENT OBJECT
      return { success: false, error: error as string };
    }
  }
  async getEventService(
    eventId: string
  ): Promise<{ success: boolean; error?: string; data?: Event }> {
    /**
     * @method getEventService
     * @description Fetches an event by its ID from the database
     * @param {string} eventId - The ID of the event to fetch
     * @returns A promise that resolves to an object containing success status, error message (if any), and the fetched event data (if successful)
     * @throws Will throw an error if database operation fails
     */
    try {
      const [dbError, dbEvent] = await prismaSafe(
        prisma.events.findUnique({
          where: { id: eventId },
          include: { EventSchedule: true, EventImage: true },
        })
      );
      // IF DB ERROR OCCURS
      if (dbError) {
        return { success: false, error: dbError };
      }
      if (!dbEvent) {
        return { success: false, error: "EVENT NOT FOUND" };
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
        images: dbEvent.EventImage.map((image) => ({
          id: image.id,
          imageUrl: image.imageUrl ?? undefined,
          imageType: image.imageType,
        })),
      };
      return { success: true, data: fetchedEvent };
    } catch (error) {
      return { success: false, error: "FAILED TO FETCH EVENT" };
    }
  }
  async listEventService(): Promise<{
    success: boolean;
    error?: string;
    data?: Event[];
  }> {
    /**
     * @method listEventService
     * @description Fetches all events from the database
     * @returns A promise that resolves to an object containing success status, error message (if any), and the list of fetched events (if successful)
     * @throws Will throw an error if database operation fails.
     */
    try {
      const [dbError, dbEvents] = await prismaSafe(
        prisma.events.findMany({
          include: { EventSchedule: true, EventImage: true },
        })
      );
      // IF DB ERROR OCCURS
      if (dbError) {
        return { success: false, error: "DATABASE ERROR OCCURRED" };
      }
      if (!dbEvents) {
        return { success: false, error: "EVENT NOT FOUND" };
      }
      // MAPPING DB EVENT TO EVENT TYPE
      const fetchedEvents: Event[] = dbEvents.map((event) => ({
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
        images: event.EventImage.map((image) => ({
          id: image.id,
          imageUrl: image.imageUrl ?? undefined,
          imageType: image.imageType,
        })),
      }));

      return { success: true, data: fetchedEvents };
    } catch (error) {
      return { success: false, error: "FAILED TO FETCH EVENT" };
    }
  }
  async updateEventService(
    eventId: string,
    eventData: Partial<Event>
  ): Promise<{ success: boolean; error?: string; data?: Event }> {
    /**
     * @method updateEventService
     * @description Updates an existing event in the database
     * @param {string} eventId - The ID of the event to update
     * @param {Partial<Event>} eventData - The event data to update
     * @returns A promise that resolves to an object containing success status, error message (if any), and the updated event data (if successful)
     * @throws Will throw an error if database operation fails.
     *
     */
    try {
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
              // DATA XA VANE UPDATE NATRA ADD DATA
              upsert:
                eventData.eventSchedule?.map((schedule) => ({
                  where: { id: schedule.id },
                  update: {
                    startDate: schedule.startDate,
                    endDate: schedule.endDate,
                    description: schedule.description,
                  },
                  create: {
                    startDate: schedule.startDate,
                    endDate: schedule.endDate,
                    description: schedule.description,
                  },
                })) || [],
            },
            EventImage: {
              upsert:
                eventData.images?.map((image) => ({
                  where: { id: image.id },
                  update: {
                    imageUrl: image.imageUrl,
                    imageType: image.imageType,
                  },
                  create: {
                    imageUrl: image.imageUrl,
                    imageType: image.imageType,
                  },
                })) || [],
            },
          },
          include: { EventSchedule: true, EventImage: true },
        })
      );
      // IF DB ERROR OCCURS
      if (dbError) {
        return { success: false, error: dbError };
      }
      if (!dbEvent) {
        return { success: false, error: "EVENT NOT FOUND OR NOT UPDATED" };
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
        images: dbEvent.EventImage.map((image) => ({
          id: image.id,
          imageUrl: image.imageUrl ?? undefined,
          imageType: image.imageType,
        })),
      };
      return { success: true, data: updatedEvent };
    } catch (error) {
      return { success: false, error: "FAILED TO UPDATE EVENT" };
    }
  }
  async deleteEventService(
    eventId: string
  ): Promise<{ success: boolean; error?: string }> {
    /**
     * @method deleteEventService
     * @description Deletes an event by its ID from the database
     * @param {string} eventId - The ID of the event to delete
     * @returns A promise that resolves to an object containing success status and error message (if any)
     * @throws Will throw an error if database operation fails
     * 
     * yedi hard delete garne vaye ,no need of properties such as deletedAt in prisma schema
     * if sotd delete ho vane we can set isDeleted to true and set deletedAt to current timestamp
     */

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
        return { success: false, error: "EVENT NOT FOUND OR NOT DELETED" };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: "FAILED TO DELETE EVENT" };
    }
  }
}
export const eventService = new EventService();