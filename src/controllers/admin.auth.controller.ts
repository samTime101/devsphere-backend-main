import type { Request, Response } from 'express';
import { ErrorResponse, SuccessResponse } from '@/dtos/index.js';
import adminAuthService from '@/services/admin.auth.service.js';

// MODIFIED BY SAMIP REGMI, 
// I HAVE ONLY ADDED SIGNUP INTERFACE, NOTHING ELSE
import type { SignupRequest } from '@/utils/types/signup.js';


export class AdminAuthController {
    async signup(req: Request, res: Response) {
        try {
            const { email, password, memberId }: SignupRequest = req.body;

            if (!email || !password) {
                return res.status(400).json(ErrorResponse(400, 'Email and password are required'));
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json(ErrorResponse(400, 'Please provide a valid email address'));
            }

            if (password.length < 8) {
                return res.status(400).json(ErrorResponse(400, 'Password must be at least 8 characters long'));
            }

            const existingUserResult = await adminAuthService.findAdminByEmail(email);
            if (existingUserResult.data) {
                return res.status(409).json(ErrorResponse(409, 'Admin user with this email already exists'));
            }

            const result = await adminAuthService.createAdminUser({
                email,
                password,
                memberId
            });

            if (!result.success) {
                return res.status(400).json(ErrorResponse(400, result.error || 'Failed to create admin user'));
            }

            if (!result.data) {
                return res.status(500).json(ErrorResponse(500, 'Failed to create admin user'));
            }

            return res.status(201).json(SuccessResponse(201, 'Admin account created successfully', result.data));
        } catch (error) {
            console.error('Admin signup error:', error);
            return res.status(500).json(ErrorResponse(500, 'Internal server error'));
        }
    }

  
   
}

export default new AdminAuthController();
