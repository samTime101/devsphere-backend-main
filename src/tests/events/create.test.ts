// ADDED TESTING FOR MY ENDPOINT 
// FOR NOW (CREATE EVENT ENDPOINT)
// SEP 15 2025
// SAMIP REGMI

// PLEASE READ ALL THE COMMENTS BEFORE CHANGING OR RUNNING ANYTHING


import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '@/index.js';



// TO RUN A SPECIFIC TEST ONLY USE .only
// TO SKIP A TEST USE .skip

// EXAMPLE: describe.only(...) or describe.skip(...)

// IF YOU DONT WANNA SKIP ANY TEST JUST USE describe(...)


// SUCCESS EVENT CREATION TEST 
describe('POST /api/event/create', () => {
  it('CREATES AN EVENT', async () => {
    const res = await request(app)
      .post('/api/event/create')
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

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    // U CAN ADD MORE EXPECTATIONS IF U WANT
  });
});

// FAILURE TEST - MISSING NAME
describe('POST /api/event/create', () => {
  it('FAILS TO CREATE AN EVENT WITHOUT A NAME', async () => {
    const res = await request(app)
      .post('/api/event/create')
      .send({
        description: "ALPHABET",
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

