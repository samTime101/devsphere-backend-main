import type {NextFunction, Request, Response} from "express";
import { ErrorResponse, SuccessResponse } from "@/dtos";

export default function responseHandler(_req: Request, res: Response, next: NextFunction) {
    res.success = function <T = any>(payload: { data?: T | null | undefined; message?: string; code?: number; } | undefined) {
        const response = SuccessResponse<T>(
            payload?.code ?? 200,
            payload?.message ?? "Success",
            payload?.data ?? undefined
        );
        return res.status(response.code).json(response);
    };

    res.error = function <D = any>(payload: { error?: string; details?: D | null | undefined; code?: number; } | undefined) {
        const response = ErrorResponse<D>(
            payload?.code ?? 500,
            payload?.error ?? "Internal Server Error",
            payload?.details ?? undefined
        );
        return res.status(response.code).json(response);
    };

    next();
}