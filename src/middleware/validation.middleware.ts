import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodTypeAny } from 'zod';
import { HTTP } from '@/utils/constants';

export function validateData<T extends ZodTypeAny>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map(issue => ({
                    field: issue.path.length > 0 ? issue.path.join('.') : 'body',
                    message: issue.message,
                    code: issue.code,
                }));

                res.status(HTTP.BAD_REQUEST).json({
                    error: 'Invalid data',
                    details: errorMessages,
                });
            } else {
                console.error('Unexpected error during validation:', error);
                res
                    .status(HTTP.INTERNAL)
                    .json({ error: 'Internal Server Error' });
            }
        }
    };
}