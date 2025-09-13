// SAMIP REGMI
// SEP 13 2025
import { z } from 'zod';


// *.strict()* PREVENTS ADDITIONAL FIELDS OTHER THAN DEFINED ONES

// THESE MESSAGE CAN ALSO BE ACCESSED AND SEND TO FRONTEND FOR BETTER UX
// BUT LIKE IF THERE IS TOO MUCH EMPTY FIELDS IT WILL BE TOO MUCH ERROR MESSAGE SO 
// I HAVE NOT LOGGED IN PARSER BUT IT CAN BE ACCESSED AND SENT TO ERROR LOGS IF WE WANT
// FOR BETTER SEE THIS-->https://www.npmjs.com/package/zod

export const eventScheduleSchema  = z.object({
    startDate: z.string().min(1,"START DATE IS REQUIRED"),
    endDate: z.string().min(1,"END DATE IS REQUIRED"),
    description: z.string().min(1,"DESCRIPTION IS REQUIRED"),
    
}).strict();

export const eventSchema = z.object({ 
    title: z.string().min(1,"TITLE IS REQUIRED"),
    description: z.string().min(1,"DESCRIPTION IS REQUIRED"),
    status: z.string().min(1,"STATUS IS REQUIRED"),
    EventSchedule: z.array(eventScheduleSchema).nonempty("AT LEAST ONE SCHEDULE IS REQUIRED"),
}).strict();

// TYPE EXPORTS
export type Event = z.infer<typeof eventSchema>;
export type EventSchedule = z.infer<typeof eventScheduleSchema>;