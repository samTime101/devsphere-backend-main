// SEP 15 2025
// SAMIP REGMI

// PLEASE READ CHECK create.test.ts FOR INFO


import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '@/index.js';


// GET EVENT FOR SPECIFIC ID TEST
describe('GET /api/event/:id', () => {
  it('FETCHES THE EVENT FOR A SPECIFIC ID', async () => {
    // DATABASE KO ID HO NOT RANDON ID, CHANGE GARDA DB BATA ID LIYA
    const eventId = 'ef680dc6-3445-47b0-9b37-a14a187baa38';
    const res = await request(app)
      .get(`/api/event/${eventId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // U CAN ADD MORE EXPECTATIONS IF U WANT
  });
});
