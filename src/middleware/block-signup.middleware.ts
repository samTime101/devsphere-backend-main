import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware to block public user registration
 * This prevents users from creating accounts via the better-auth sign-up endpoints
 * while still allowing admin-created users and sign-in functionality
 */
export const blockSignup = (req: Request, res: Response, next: NextFunction) => {
    const signupPaths = [
        '/api/auth/sign-up/email',
        '/api/auth/sign-up',
        '/api/auth/signup',
        '/api/auth/register'
    ];

    const isSignupRequest = signupPaths.some(path =>
        req.path === path ||
        req.url === path ||
        req.originalUrl === path
    );

    const containsSignup = req.path.includes('sign-up') ||
        req.path.includes('signup') ||
        req.url.includes('sign-up') ||
        req.url.includes('signup');

    if ((isSignupRequest || containsSignup) && req.method === 'POST') {
        return res.status(403).json({
            error: 'Registration is disabled',
            message: 'New user registration is not allowed. Please contact an administrator to create your account.',
            code: 'REGISTRATION_DISABLED'
        });
    }

    next();
};
