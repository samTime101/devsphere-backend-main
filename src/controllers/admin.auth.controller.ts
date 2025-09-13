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
                const errorResponse = new ErrorResponse({
                    error: 'Email and password are required',
                    code: 400
                });
                return res.status(400).json(errorResponse);
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                const errorResponse = new ErrorResponse({
                    error: 'Please provide a valid email address',
                    code: 400
                });
                return res.status(400).json(errorResponse);
            }

            if (password.length < 8) {
                const errorResponse = new ErrorResponse({
                    error: 'Password must be at least 8 characters long',
                    code: 400
                });
                return res.status(400).json(errorResponse);
            }

            const [existingUserError, existingUser] = await adminAuthService.findAdminByEmail(email);
            if (existingUser) {
                const errorResponse = new ErrorResponse({
                    error: 'Admin user with this email already exists',
                    code: 409
                });
                return res.status(409).json(errorResponse);
            }

            const [error, result] = await adminAuthService.createAdminUser({
                email,
                password,
                memberId
            });

            if (error) {
                const errorResponse = new ErrorResponse({
                    error,
                    code: 400
                });
                return res.status(400).json(errorResponse);
            }

            if (!result) {
                const errorResponse = new ErrorResponse({
                    error: 'Failed to create admin user',
                    code: 500
                });
                return res.status(500).json(errorResponse);
            }

            const response = new SuccessResponse({
                data: result,
                message: 'Admin account created successfully',
                code: 201
            });

            res.status(201).json(response);
        } catch (error) {
            console.error('Admin signup error:', error);
            const errorResponse = new ErrorResponse({
                error: 'Internal server error',
                code: 500
            });
            res.status(500).json(errorResponse);
        }
    }

  
   
}

export default new AdminAuthController();
