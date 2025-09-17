// SEP 16 2025
// SAMIP REGMI
// FOR SIGNIN ENDPOINT

// PLEASE READ **tests/events/create.test.ts** FOR MORE INFO AND COMMENT ABOUT TEST FILES

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '@/index.js';

// SUCCESS USER SIGN TEST 
describe('POST /api/auth/sign-in/email', () => {
  it('SIGNS IN A USER', async () => {
    const res = await request(app)
      .post('/api/auth/sign-in/email')
      .send({
        email:"test@example.com",
        password:"mypassword123",
        rememberme:"false",
        callbackurl:"http://localhost:3000"
      });

    expect(res.status).toBe(200);
    // EXPECT TOKEN
    expect(res.body.token).toBeDefined();
  },20000);// 20 SECOND TIMEOUT INCREASE GARA ERROR AYO VANE
});

// FAILURE TEST - FAKE PASS
describe('POST /api/auth/sign-in/email', () => {
  it('FAILS TO SIGN IN WITH A FAKE PASSWORD', async () => {
    const res = await request(app)
      .post('/api/auth/sign-in/email')
      .send({
        email:"test@example.com",
        password:"fakepassword",
        rememberme:"false",
        callbackurl:"http://localhost:3000"
      });
    
    expect(res.status).toBe(401);
    // U CAN ADD MORE EXPECTATIONS IF U WANT
  });
});

