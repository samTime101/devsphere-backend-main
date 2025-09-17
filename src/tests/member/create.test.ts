// SEP 16 2025
// SAMIP REGMI
// FOR MEMBER CREATION ENDPOINT TESTING

// PLEASE READ **tests/events/create.test.ts** FOR MORE INFO AND COMMENT ABOUT TEST FILES

import type { Response, Request, NextFunction } from 'express';
import { describe, it, expect,vi } from 'vitest';


// WHEN U RUN THIS WITHOUT TAKING THE IMPORT ORIGINAL
// IT GIVES ERROR BECAUSE OF THE ASYNC AWAIT IN THE ACTUAL MIDDLEWARE
// SO TO BYPASS THAT WE HAVE TO USE importOriginal
// PURAI DIRECT YO CODE NAI ERROR MA DEKO HO HAI **vitest** LE 

vi.mock('@/middleware/auth.middleware', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual as object,
    isModerator: async (req: Request, res: Response, next: NextFunction) => {
      next();
      return undefined;
    },
  }
})
import request from 'supertest';
import app from '@/index.js';

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

