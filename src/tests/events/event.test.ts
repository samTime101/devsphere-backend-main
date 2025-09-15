// SEP 15 2025
// SAMIP REGMI

// PLEASE READ CHECK create.test.ts FOR INFO


import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '@/index.js';


// GET EVENT FOR SPECIFIC ID TEST
describe('GET /api/event/id/:id', () => {
  it('FETCHES THE EVENT FOR A SPECIFIC ID', async () => {
    // DATABASE KO ID HO NOT RANDON ID, CHANGE GARDA DB BATA ID LIYA
    const eventId = '1abbc5f4-ab69-43b4-819d-f4030fb232c2';
    const res = await request(app)
      .get(`/api/event/id/${eventId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // U CAN ADD MORE EXPECTATIONS IF U WANT
  });
});
