/**
 * @todo convert capital letters to small letters in test descriptions and comments
 * @todo fix the failure test
 * @todo format the code from prettier
 * @todo add more test cases
 * @todo test image upload functionality
 * @author Samip Regmi (samTime101)
 */


// ADDED TESTING FOR MY ENDPOINT 
// FOR NOW (CREATE EVENT ENDPOINT)
// SEP 15 2025
// SAMIP REGMI

// PLEASE READ ALL THE COMMENTS BEFORE CHANGING OR RUNNING ANYTHING

import type { Response, Request, NextFunction } from 'express';
import { describe, it, expect,vi } from 'vitest';
import { setEventId } from '@/tests/01-events/shared-eventid';

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
    isModerator: async (req: Request, res: Response, next: NextFunction) => {
      next();
    },
  }
})
import request from 'supertest';
import app from '@/index.js';


// SUCCESS EVENT CREATION TEST 
// SUCCESS EVENT CREATION TEST 
describe('POST /api/event/', () => {
  it('CREATES AN EVENT', async () => {
    const res = await request(app)
      .post('/api/event/')
      .field(
        'eventData',
        JSON.stringify({
          name: 'SUPERMAN IS NICE',
          description: 'TEST',
          status: 'UPCOMING',
          eventSchedule: [
            {
              startDate: new Date().toISOString(),
              endDate: new Date().toISOString(),
              description: 'DAY 1',
            },
          ],
        })
      )
      .field('imageFileTypes', JSON.stringify(['PROMOTIONAL', 'GALLERY']))
      // optional: add a fake file if you want to test file upload
      // .attach('files', Buffer.from('fake-image'), 'test.png')

    setEventId(res.body.data.id);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});

// FAILURE TEST - MISSING NAME
// describe('POST /api/event/', () => {
//   it('FAILS TO CREATE AN EVENT WITHOUT A NAME', async () => {
//     const res = await request(app)
//       .post('/api/event/')
//       .field(
//         'eventData',
//         JSON.stringify({
//           description: 'TEST',
//           status: 'UPCOMING',
//           eventSchedule: [
//             {
//               startDate: new Date().toISOString(),
//               endDate: new Date().toISOString(),
//               description: 'DAY 1',
//             },
//           ],
//         })
//       )
//       .field('imageFileTypes', JSON.stringify(['PROMOTIONAL', 'GALLERY']))

//     expect(res.status).toBe(400);
//     expect(res.body.success).toBe(false);
//   });
// });