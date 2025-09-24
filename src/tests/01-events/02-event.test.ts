// SEP 15 2025
// SAMIP REGMI

// PLEASE READ CHECK create.test.ts FOR INFO


import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '@/index.js';
import { eventId } from '@/tests/01-events/shared-eventid';

// ONLY RUN TEST IF WE HAVE AN EVENT (DYNAMIC HO NO NEED OF HARDCODING ID)
describe('GET /api/event/:id', () => {
  it('FETCHES THE EVENT FOR A SPECIFIC ID', async () => {
    if (!eventId) {
      console.warn('NO EVENT FOUND SO SKIPPING TEST');
      return;
    }
    const res = await request(app)
    .get(`/api/event/${eventId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // U CAN ADD MORE EXPECTATIONS IF U WANT
  });
});

// INVALID UUID FORMAT
describe('GET /api/event/:id', () => {
  it('RETURNS 400 IF INVALID UUID IS PROVIDED', async () => {
    const res = await request(app)
    .get('/api/event/invalid-uuid');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});