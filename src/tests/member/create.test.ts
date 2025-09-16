// SEP 16 2025
// SAMIP REGMI
// FOR MEMBER CREATION ENDPOINT TESTING

// PLEASE READ **tests/events/create.test.ts** FOR MORE INFO AND COMMENT ABOUT TEST FILES

import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '@/index.js';
import type { Response, Request, NextFunction } from 'express';

// MOCK THE isModerator MIDDLEWARE TO ALWAYS PASS
// YO NAGARDA PANI HUNXA TARA HAREK TIME TOKEN DINU PARDO HEADER MA
// KITA MEMBER CREATE GARNU AGADI SIGN IN GARERA TYA DEKHI TOKEN EXPORT GARNU PARO

// BUT MOCKING IS EASIER FOR TESTING PURPOSES
// DIRECTLY NEXT GARERA AUTHENTICATION NAI BYPASS GARXA

vi.mock('@/middleware/auth.middleware', () => {
  return {
    isModerator: (req: Request, res: Response, next: NextFunction) => next(),
  };
});


// SUCCESS MEMBER CREATION TEST 
describe('POST /api/members', () => {
  it('CREATES A MEMBER', async () => {
    const res = await request(app)
    .post('/api/members')
    .send({
        name: "JOHN PORK",
        role: "DEVELOPER",
        year: new Date().toISOString()
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    // U CAN ADD MORE EXPECTATIONS IF U WANT
  }); 
});

// FAILURE TEST - MISSING NAME
describe('POST /api/members', () => {
  it('FAILS TO CREATE A MEMBER WITHOUT A NAME', async () => {
    const res = await request(app)
      .post('/api/members')
      .send({
        role: "DEVELOPER",
        year: new Date().toISOString()
      });
    
      
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    // U CAN ADD MORE EXPECTATIONS IF U WANT
  });
});

