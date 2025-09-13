// SAMIP REGMI
// SEP 13 2025
import { z } from 'zod';


// *.strict()* PREVENTS ADDITIONAL FIELDS OTHER THAN DEFINED ONES
export const EventSchedule  = z.object({
    startDate: z.string(),
    endDate: z.string(),
    description: z.string(),
    
}).strict();

export const Event = z.object({ 
    title: z.string(),
    description: z.string(),
    status: z.string(),
    EventSchedule: z.array(EventSchedule),
}).strict();

// TYPE EXPORTS
export type Event = z.infer<typeof Event>;
export type EventSchedule = z.infer<typeof EventSchedule>;