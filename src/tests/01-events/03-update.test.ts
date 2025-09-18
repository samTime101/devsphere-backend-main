// SEP 17 2025
// SAMIP REGMI
// INFO: SABAI TEST FILE MA UTA constants.ts BATA PANI IMPORT GARDA HUNTHYO
//  TARA DEPENDENCY DHERAI FILE HARUMA NAHOS VANERA YAHI RAKHEKO

import type { Response, Request, NextFunction } from 'express';
import { describe, it, expect,vi, beforeAll } from 'vitest';


// WHEN U RUN THIS WITHOUT TAKING THE IMPORT ORIGINAL
// IT GIVES ERROR BECAUSE OF THE ASYNC AWAIT IN THE ACTUAL MIDDLEWARE
// SO TO BYPASS THAT WE HAVE TO USE importOriginal
// PURAI DIRECT YO CODE NAI ERROR MA DEKO HO HAI **vitest** LE 

vi.mock('@/middleware/auth.middleware', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual as object,
    authMiddleware: async (req: Request, res: Response, next: NextFunction) => {
      next();
    },
  }
})

import request from 'supertest';
import app from '@/index.js';
import { eventId } from '@/tests/01-events/shared-eventid';

// SUCCESS EVENT UPDATE TEST
describe('PATCH /api/event/:id', () => {
  it('UPDATES AN EVENT', async () => {
    if (!eventId) {
      console.warn('NO EVENT FOUND SO SKIPPING TEST');
      return;
    }
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
    if (!eventId) {
      console.warn('NO EVENT FOUND SO SKIPPING TEST');
      return;
    }
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