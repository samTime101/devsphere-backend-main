// SAMIP REGMI
// SEP 13 2025
import { z } from 'zod';


// *.strict()* PREVENTS ADDITIONAL FIELDS OTHER THAN DEFINED ONES
export const eventScheduleSchema  = z.object({
    startDate: z.string(),
    endDate: z.string(),
    description: z.string(),
    
}).strict();

export const eventSchema = z.object({ 
    title: z.string(),
    description: z.string(),
    status: z.string(),
    EventSchedule: z.array(eventScheduleSchema),
}).strict();

// TYPE EXPORTS
export type Event = z.infer<typeof eventSchema>;
export type EventSchedule = z.infer<typeof eventScheduleSchema>;