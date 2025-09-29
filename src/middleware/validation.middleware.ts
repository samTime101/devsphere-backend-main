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


/**
 * @function validateFormData
 * @param schema 
 * @description Middleware function to validate multipart/form-data request bodies using a Zod schema
 * @returns either proceeds to the next middleware or returns a 400 Bad Request with validation errors
 * @author Samip Regmi (samTime101)
 * @date 2025-09-26
 * @since 2025-09-27
 */

export function validateFormData<T extends ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const formData = JSON.parse(req.body.eventData);
      req.body.eventData = schema.parse(formData);

      console.log("VALIDATED FORM DATA:", req.body);
      // only new images can be in req.files and they shouldnot have any id
      // also naya images ko length file ko length sanga match hunu parxa
      const newImages = formData.images?.filter((img: any) => !img.id) || [];

      console.log("NEW IMAGES:", newImages);
      console.log("NEW IMAGES LENGTH:", newImages.length);
      console.log("REQ FILES LENGTH:", req.files ? (req.files as Express.Multer.File[]).length : 0);
      if (req.files && newImages.images && newImages.images.length !== req.files.length) {
        return res
          .status(HTTP.BAD_REQUEST)
          .json(ErrorResponse(HTTP.BAD_REQUEST, "length mismatch"));
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          field: issue.path.length > 0 ? issue.path.join(".") : "formData",
          message: issue.message,
          code: issue.code,
        }));

        return res
          .status(HTTP.BAD_REQUEST)
          .json(
            ErrorResponse(HTTP.BAD_REQUEST, "invalid form data", errorMessages)
          );
      } else {
        console.error("Unexpected error during form data validation:", error);
        return res
          .status(HTTP.INTERNAL)
          .json(ErrorResponse(HTTP.INTERNAL, "Internal Server Error"));
      }
    }
  };
}