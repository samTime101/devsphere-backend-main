// SAMIP REGMI
// SEP 13 2025
export interface Event {
    title: string;
    description: string;
    status: string;
    EventSchedule: EventSchedule[];
}
export interface EventSchedule {
    startDate: string;
    endDate: string;
    description: string;
    event: Event;
}