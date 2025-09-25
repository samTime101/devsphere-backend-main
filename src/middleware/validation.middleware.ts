import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodTypeAny } from 'zod';
import { HTTP } from '@/utils/constants';
import { ErrorResponse } from '@/dtos';

export function validateBody<T extends ZodTypeAny>(schema: T) {
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

                res.status(HTTP.BAD_REQUEST).json(ErrorResponse(HTTP.BAD_REQUEST, 'Invalid request body', errorMessages));
            } else {
                console.error('Unexpected error during body validation:', error);
                res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, 'Internal Server Error'));
            }
        }
    };
}

export function validateParams<T extends ZodTypeAny>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.params = schema.parse(req.params) as any;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map(issue => ({
                    field: issue.path.length > 0 ? issue.path.join('.') : 'params',
                    message: issue.message,
                    code: issue.code,
                }));

                res.status(HTTP.BAD_REQUEST).json(ErrorResponse(HTTP.BAD_REQUEST, 'Invalid request parameters', errorMessages));
            } else {
                console.error('Unexpected error during params validation:', error);
                res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, 'Internal Server Error'));
            }
        }
    };
}

export function validateQuery<T extends ZodTypeAny>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedQuery = schema.parse(req.query);
            // Store in a separate property
            (req as any).validatedQuery = parsedQuery;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map(issue => ({
                    field: issue.path.length > 0 ? issue.path.join('.') : 'query',
                    message: issue.message,
                    code: issue.code,
                }));

                res.status(HTTP.BAD_REQUEST).json(ErrorResponse(HTTP.BAD_REQUEST, 'Invalid query parameters', errorMessages));
            } else {
                console.error('Unexpected error during query validation:', error);
                res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, 'Internal Server Error'));
            }
        }
    };
}

export function validateFormData(bodySchema: ZodTypeAny, fileTypesSchema: ZodTypeAny) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body || !req.body.eventData || !req.body.imageFileTypes) {
                return res.status(HTTP.BAD_REQUEST).json(ErrorResponse(HTTP.BAD_REQUEST, 'eventdata and imagetype are both required'));
            }
            req.body.eventData = bodySchema.parse(JSON.parse(req.body.eventData));
            req.body.imageFileTypes = fileTypesSchema.parse(JSON.parse(req.body.imageFileTypes));
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map(issue => ({
                    field: issue.path.length > 0 ? issue.path.join('.') : 'formData',
                    message: issue.message,
                    code: issue.code,
                }));

                res.status(HTTP.BAD_REQUEST).json(ErrorResponse(HTTP.BAD_REQUEST, 'Invalid form data', errorMessages));
            } else {
                console.error('error', error);
                res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, 'Internal Server Error'));
            }
        }
    };
}