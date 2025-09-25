    // SAMIP REGMI
    // SEP 13 2025
    import { z } from 'zod';


    // *.strict()* PREVENTS ADDITIONAL FIELDS OTHER THAN DEFINED ONES

    // THESE MESSAGE CAN ALSO BE ACCESSED AND SEND TO FRONTEND FOR BETTER UX
    // BUT LIKE IF THERE IS TOO MUCH EMPTY FIELDS IT WILL BE TOO MUCH ERROR MESSAGE SO 
    // I HAVE NOT LOGGED IN PARSER BUT IT CAN BE ACCESSED AND SENT TO ERROR LOGS IF WE WANT
    // FOR BETTER SEE THIS-->https://www.npmjs.com/package/zod


    // TRIED ADDING DIRECT DATE FILED **z.date()** BUT IT WAS GIVING ERROR SO I USED STRING AND CONVERTED TO DATE IN SERVICE LAYER
    // JSON MA DIRECT DATE OBJECT SEND GARNA PAIDAINA RAIXA

    const imageTypesArray = ["PROMOTIONAL", "GALLERY", "GUESTS"] as const;
    const eventStatusesArray = ["UPCOMING", "ONGOING", "COMPLETED"] as const;

    export const eventScheduleSchema  = z.object({
        // OPTIONAL ID
        id: z.string().optional(),
        startDate: z.preprocess(arg => new Date(arg as string), z.date()),
        endDate: z.preprocess(arg => new Date(arg as string), z.date()),
        description: z.string().min(1,"DESCRIPTION IS REQUIRED"),
    }).strict();

    export const eventImageSchema = z.object({
        id: z.string().optional(),
        imageUrl: z.url("INVALID IMAGE URL"),
        uploadedAt: z.preprocess(arg => new Date(arg as string), z.date()).optional(),
        deletedAt: z.preprocess(arg => new Date(arg as string), z.date()).nullable().optional(),
        imageType: z.enum(imageTypesArray)
    }).strict();

    export const eventSchema = z.object({ 
        // OPTIONAL ID
        id: z.string().optional(),
        name: z.string().min(1,"EVENT NAME IS REQUIRED"),
        description: z.string().min(1,"DESCRIPTION IS REQUIRED"),
        status: z.enum(eventStatusesArray),
        eventSchedule: z.array(eventScheduleSchema).nonempty("AT LEAST ONE SCHEDULE IS REQUIRED"),
        images: z.array(eventImageSchema).optional(),
    }).strict();


    // RUN TIME SCHEMA
    export const eventImageTypeSchema = z.array(z.enum(imageTypesArray));

    // TYPE EXPORTS | ONLY FOR TYPE CHECKING, NOT FOR RUNTIME USE
    export type Event = z.infer<typeof eventSchema>;
    export type EventSchedule = z.infer<typeof eventScheduleSchema>;
    export type EventImage = z.infer<typeof eventImageSchema>;
    export type EventImageType = typeof imageTypesArray[number];
    //  INFO : THIS EXACT SCHEMA WAS DEFINED ALREADY ON user.schema.ts FILE,
    //  IT WOULD BE BETTER TO CREATE A NEW FILE NAMED common.schema.ts AND EXPORT IT FROM THERE
    // ALSO .string.uuid IS DEPRECATED SO I USED z.uuid()

    export const eventParamsSchema = z.object({
        id: z.uuid("INVALID EVENT UUID")
    });
