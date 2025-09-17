// SEP 17 2025
// SAMIP REGMI
// INFO: SABAI TEST FILE MA UTA constants.ts BATA PANI IMPORT GARDA HUNTHYO
//  TARA DEPENDENCY DHERAI FILE HARUMA NAHOS VANERA YAHI RAKHEKO

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '@/index.js';

let eventId:string = '98f87233-949b-4b7f-baf5-195e81a0e07b'

// SUCCESS EVENT UPDATE TEST
describe('PATCH /api/event/:id', () => {
  it('UPDATES AN EVENT', async () => {
    const res = await request(app)
      .patch(`/api/event/${eventId}`)
      .send({
        name: "NEW APPLE BANANA",
        description: "TEST",
        status: "UPCOMING",
        eventSchedule: [
          {
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            description: "DAY 1"
        }
        ]
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // U CAN ADD MORE EXPECTATIONS IF U WANT
  });
});

// FAILURE TEST
describe('PATCH /api/event/:id', () => {
  it('FAILS TO UPDATE AN EVENT WITHOUT DESCRIPTION', async () => {
    const res = await request(app)
      .patch(`/api/event/${eventId}`)
      .send({
        // INSTEAD OF DESCRIPTION I PUT NAME
        name: "ALPHABET",
        status: "UPCOMING",
        eventSchedule: [
          {
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            description: "DAY 1"
        }
        ]
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('INVALID EVENT DATA GIVEN');
    // U CAN ADD MORE EXPECTATIONS IF U WANT
  });
});