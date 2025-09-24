// SEP 15 2025
// SAMIP REGMI

// PLEASE READ CHECK create.test.ts FOR INFO


import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '@/index.js';


// GET EVENT LIST TEST 
describe('GET /api/event/', () => {
  it('FETCHES THE EVENT LIST PAGE', async () => {
    const res = await request(app)
      .get('/api/event/');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // U CAN ADD MORE EXPECTATIONS IF U WANT
  });
});
