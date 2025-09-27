/**
 * @file        event.service.ts
 * @fileoverview Service layer for managing events, including creation, retrieval, updating, and deletion
 * @author      Samip Regmi (samTime101)
 * @date        2025-09-14
 * @since       2025-09-27
 * @module      services/event.service
 * @requires    prismaSafe
 * @requires    prisma
 * @requires    Event
 * @requires    EventSchedule
 * @requires    EventImageType
 * @requires    EventImage
 * @requires    uploadImageToCloudinary
 * @requires    deleteImageFromCloudinary
 * 
 * @todo        Remove whole folder on cloudinary when event is deleted
 * 
 * formatted with prettier
 * 
 * @example
 * for eventCreation and eventUpdate
 * i suggest u to use insomnia because multiline text field seems to work fine there
 * on sending request set the body to form-data
 * add key as eventData and set type to Multiline text
 * add another key as imageFiles and set type to File, also if ur api client doesnot support multiple fileupload in single key 
 * u can add another key as imageFiles
 */

import { prismaSafe } from "@/lib/prismaSafe.ts";
import prisma from "@/db/prisma.js";
import type { Event, EventSchedule, EventImage } from "@/lib/zod/event.schema";
import { uploadImageToCloudinary } from "@/utils/cloudinary.uploader.ts";
import { deleteImageFromCloudinary, deleteEventFolderFromCloudinary } from "@/utils/cloudinary.remover.ts";

/**
 * @function uploadEventImage
 * @description Uploads event images to Cloudinary and returns their URLs along with their types
 * @param {Express.Multer.File[]} imageFiles - The image files to upload
 * @param {Event} event - The event data containing image types
 * @returns {Promise<EventImage[]>} - A promise that resolves to an array of uploaded event images with their URLs and types
 * @throws Will throw an error if image upload fails
 * 
 */

const uploadEventImages = async (
  event: Event,
  imageFiles: Express.Multer.File[]
): Promise<EventImage[]> => {
  if (!event.images || event.images.length === 0) {
    throw new Error("NO IMAGE DATA PROVIDED IN EVENT OBJECT");
  }

  // console.log(event.status)
  // event ko id ta event db ma save vaye paxi aauxa and this shit is before pusing event data to db
  // that means we cant access id of event before it is pushed to db
  // name is only option , cant think of other as of now

  //seperate save garne not nested

  // take only new images
  const newImages = event.images.filter((img) => !img.id);
  if (newImages.length !== imageFiles.length) {
    throw new Error("IMAGE FILES AND EVENT IMAGES LENGTH MISMATCH");
  }

  // naya image haru matra upload
  const uploadResults = await Promise.all(
    imageFiles.map((file, index) =>
      uploadImageToCloudinary(file.path, {
        folder: `events/${event.name}/${newImages[index].imageType}`,
      })
    )
  );

  return uploadResults.map((result, index) => ({
    imageUrl: result.url!,
    publicId: result.publicId!,
    imageType: newImages[index].imageType,
  }));
};

/**
 * @class EventService
 * @classdesc Service class for managing event-related operations
 */

class EventService {
  /**
   * @method createEventService
   * @description Uploads event images to Cloudinary and creates a new event in the database
   * @param {Event} eventData - The event data to create
   * @param {Express.Multer.File[]} imageFiles - The image files to upload
   * @returns A promise that resolves to an object containing success status, error message (if any), and the created event data (if successful)
   * @throws Will throw an error if image upload or database operation fails.
   */
  async createEventService(
    eventData: Event,
    imageFiles: Express.Multer.File[]
  ): Promise<{ success: boolean; error?: string; data?: Event }> {
    try {
      if (imageFiles && imageFiles.length > 0) {
        console.log("UPLOADING IMAGES TO CLOUDINARY");
        const uploadResults = await uploadEventImages(
          eventData as Event,
          imageFiles as Express.Multer.File[]
        );
        // jamma duita property set hunxa imageUrl ra imageType
        eventData.images = uploadResults;
      }
      console.log("IMAGES UPLOADED TO CLOUDINARY");
      console.log("EVENT DATA WITH IMAGES:", eventData);
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
          publicId: image.publicId ?? undefined,
        })),
      };
      // ONLY SEND EVENT CREATION DATA !DONT SEND ERROR MESSAGE SEND NULL INSTEAD
      return { success: true, data: createdEvent };
    } catch (error) {
      // ONLY SEND ERROR MESSAGE AND NULL EVENT OBJECT
      return { success: false, error: error as string };
    }
  }
  /**
   * @method getEventService
   * @description Fetches an event by its ID from the database
   * @param {string} eventId - The ID of the event to fetch
   * @returns A promise that resolves to an object containing success status, error message (if any), and the fetched event data (if successful)
   * @throws Will throw an error if database operation fails
   */
  async getEventService(
    eventId: string
  ): Promise<{ success: boolean; error?: string; data?: Event }> {
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
          publicId: image.publicId ?? undefined,
        })),
      };
      return { success: true, data: fetchedEvent };
    } catch (error) {
      return { success: false, error: "FAILED TO FETCH EVENT" };
    }
  }
  /**
   * @method listEventService
   * @description Fetches all events from the database
   * @returns A promise that resolves to an object containing success status, error message (if any), and the list of fetched events (if successful)
   * @throws Will throw an error if database operation fails.
   */
  async listEventService(): Promise<{
    success: boolean;
    error?: string;
    data?: Event[];
  }> {
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
          publicId: image.publicId ?? undefined,
        })),
      }));

      return { success: true, data: fetchedEvents };
    } catch (error) {
      return { success: false, error: "FAILED TO FETCH EVENT" };
    }
  }
  /**
   * @method updateEventService
   * @description Updates an existing event in the database
   * @param {string} eventId - The ID of the event to update
   * @param {Partial<Event>} eventData - The event data to update
   * @param {Express.MimageTypeulter.File[]} [imageFiles] - Optional image files to upload
   * @returns A promise that resolves to an object containing success status, error message (if any), and the updated event data (if successful)
   * @throws Will throw an error if database operation fails.
   *
   */
  async updateEventService(
    eventId: string,
    eventData: Partial<Event>,
    imageFiles?: Express.Multer.File[]
  ): Promise<{ success: boolean; error?: string; data?: Event }> {
    try {
      // so user le chai event data update garna pauxa
      // event schedule data usle update(existing lai update || add new schedule) , delete garna pauxa

      // event update is easy , function mai id aauxa
      // search the event and update the values that are changed if not changed leave as it is

      // eventSchedule ma chai we will store event schedule data in a variable
      // var1-> userFedEventScheduleData
      // var2-> existingEventScheduleDataFromDB

      // check id  and map id of var1 and var2
      // if existing data id is updated in user fed data -> update that data
      // if existing data id is not in user fed data -> delete that data
      // if user fed data has new data with no id -> create that data

      // event ko existing data yei defined method le fetch garxa
      const existingEventResponse = await this.getEventService(eventId);
      if (!existingEventResponse.success || !existingEventResponse.data) {
        return { success: false, error: "EVENT NOT FOUND" };
      }
      const existingEventData: Event = existingEventResponse.data;
      const existingEventScheduleData: EventSchedule[] =
        existingEventData.eventSchedule || [];
      const existingEventImagesData: EventImage[] =
        existingEventData.images || [];
      const userFedEventData: Partial<Event> = eventData;
      const userFedEventScheduleData: EventSchedule[] =
        eventData.eventSchedule || [];
      const userFedEventImagesData: EventImage[] = eventData.images || [];


      console.log("EXISTING EVENT DATA: ", existingEventData)


      // for images we simply check if user has uploaded new images
      // if yes we upload those images and create new entries in db
      // we also check for image deletion , we will handle by checking image ids
      // if user fed data has image ids that are not in existing data we delete those images from db
      // and also delete from cloudinary
      // we will also check for imageType update, tyo chai we are checking by id
      // put all the images to *imageToDelete* array that are in existing data but not in user fed data

      // if imageFiles exist we upload those images and add the data to *imagesToCreate* array
      // if not empty array mai xordiney

      const imagesToCreate: EventImage[] = imageFiles?.length
      ? await uploadEventImages(eventData as Event, imageFiles)
        : [];
        
      const imagesToDelete: EventImage[] = existingEventImagesData.filter(
        (existingImg) =>
          !userFedEventImagesData.some(
            (img) => img.id === existingImg.id
          )
      );
      const imagesToUpdate: EventImage[] = userFedEventImagesData.filter(
        (img) => img.id && img.imageType
      );


      console.log("IMAGES TO CREATE: ", imagesToCreate);
      console.log("IMAGES TO DELETE: ", imagesToDelete);
      console.log("IMAGES TO UPDATE: ", imagesToUpdate);
      console.log("TEST")

      // deleting images from cloudinary
      for (const image of imagesToDelete) {
        console.log("DELETING IMAGE FROM CLOUDINARY: ", image);
        if (image.publicId) {
          const deleteResult = await deleteImageFromCloudinary(image.publicId);
          if (!deleteResult.success) {
            console.log(
              `FAILED TO DELETE IMAGE FROM CLOUDINARY: ${deleteResult.error}`
            );
          }
          
        }else{
          console.log("NO PUBLIC ID FOR IMAGE, SKIPPING CLOUDINARY DELETE")
        }
      }

      // we are looping and checking if id exists in user fed data
      // if exists we push to update array
      // if not exists we push to delete array
      // if user fed data has no id we push to create array
      const schedulesToUpdate: EventSchedule[] =
        userFedEventScheduleData.filter((schedule) => schedule.id);
      const schedulesToDelete: EventSchedule[] =
        existingEventScheduleData.filter(
          (existingSchedule) =>
            !userFedEventScheduleData.some(
              (schedule) => schedule.id === existingSchedule.id
            )
        );
      const schedulesToCreate: EventSchedule[] =
        userFedEventScheduleData.filter((schedule) => !schedule.id);
      
      // simple mapping matrai xa, chaine data haru sabai calculate vako xa 
      // we are simply mapping data to respective operations
      const [dbError, dbEvent] = await prismaSafe(
        prisma.events.update({
          where: { id: eventId },
          data: {
            name: userFedEventData.name,
            description: userFedEventData.description,
            status: userFedEventData.status,
            EventSchedule: {
              // update schedules
              update: schedulesToUpdate.map((schedule) => ({
                where: { id: schedule.id! },
                data: {
                  startDate: schedule.startDate,
                  endDate: schedule.endDate,
                  description: schedule.description,
                },
              })),
              // delete schedules
              delete: schedulesToDelete.map((schedule) => ({
                id: schedule.id!,
              })),
              // create new schedules
              create: schedulesToCreate.map((schedule) => ({
                startDate: schedule.startDate,
                endDate: schedule.endDate,
                description: schedule.description,
              })),
            },
            EventImage: {
              // image creare
              create: imagesToCreate.map((image) => ({
                imageUrl: image.imageUrl,
                imageType: image.imageType,
                publicId: image.publicId,
              })),
              // event update
              update: imagesToUpdate.map((image) => ({
                where: { id: image.id! },
                data: {
                  imageType: image.imageType,
                },
              })),
              // image delete
              delete: imagesToDelete.map((image) => ({
                id: image.id!,
              })),
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
        return { success: false, error: "EVENT NOT UPDATED" };
      }
      // MAPPING DB EVENT TO EVENT TYPE
      const updatedEvent: Event = {
        id: dbEvent.id,
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
  async deleteEventService(
    eventId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // get all the images related to the event
      const eventImages = await prisma.eventImage.findMany({
        where: { eventId },
      });
      console.log("FROM DELETE ENDPOINT ", eventImages);
      //yei manually strip split garera event ko naam leko
      const eventName = eventImages.length > 0 ? eventImages[0].publicId?.split('/')[1] : 'unknown_event';
      console.log("EVENT NAME: ", eventName)

      //delete whole event folder from cloudinary
      const deleteFolderResult = await deleteEventFolderFromCloudinary(`events/${eventName}/`);
      if(!deleteFolderResult.success){
        console.log("FAILED TO DELETE EVENT FOLDER FROM CLOUDINARY: ", deleteFolderResult.error)
      }

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
