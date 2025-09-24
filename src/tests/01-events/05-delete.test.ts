// SEP 18 2025
// SAMIP REGMI

// PLEASE READ CHECK create.test.ts FOR INFO


import type { Response, Request, NextFunction } from 'express';
import { describe, it, expect,vi, beforeAll } from 'vitest';

// YESMA CHAI DUITAI MIDDLE WARE XA HAI , ROUTER MA CHECK GARDA HUNXA
vi.mock('@/middleware/auth.middleware', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual as object,
    isModerator: async (req: Request, res: Response, next: NextFunction) => {
      next();
    },
    authMiddleware: async (req: Request, res: Response, next: NextFunction) => {
        next();
  }
}
})
import request from 'supertest';
import app from '@/index.js';
import { eventId } from '@/tests/01-events/shared-eventid';

// ONLY RUN TEST IF WE HAVE AN EVENT (DYNAMIC HO NO NEED OF HARDCODING ID)
describe('DELETE /api/event/:id', () => {
  it('DELETES THE EVENT FOR A SPECIFIC ID', async () => {
    if (!eventId) {
      console.warn('NO EVENT FOUND SO SKIPPING TEST');
      return;
    }
    const res = await request(app)
    .delete(`/api/event/${eventId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});



// UUID FORMAT INVALID
describe('DELETE /api/event/:id', () => {
  it('RETURNS 400 IF INVALID UUID IS PROVIDED', async () => {
    const res = await request(app)
    .delete('/api/event/invalid-uuid');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});