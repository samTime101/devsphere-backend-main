// SAMIP REGMI
// SEP 13 2025
// EVENT TYPE IMPORT
import type { Event } from '@/utils/types/event';

// ZOD SCHEMA IMPORT FOR PARSING AND VALIDATION
import { eventSchema } from '@/utils/types/event';


// IF SUCCESS SEND {success: true, data: parsedData} 
// IF FAILURE SEND {success: false, error: errorMessage}
async function eventParser(data: Event): Promise<{ success: boolean; error?: string; data?: Event }> {
    // PARSING 
    try{
        const parsedData = eventSchema.parse(data);
        return { success: true, data: parsedData };
    } catch (error) {
        console.log(`Failed to parse event data, ${error}`);
        return { success: false, error: 'INVALID EVENT DATA GIVEN' };
    }
}

export default eventParser;