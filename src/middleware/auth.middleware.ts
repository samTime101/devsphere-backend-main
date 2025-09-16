import { ErrorResponse } from "@/dtos";
import { auth } from "@/lib/auth";
import { HTTP } from "@/utils/constants";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express"
import type { User } from "better-auth";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const headers = fromNodeHeaders(req.headers)
        const session  = await auth.api.getSession({ headers })
        if (session) {
            (req as Request & { user: User }).user = session.user
            next()
        }
        else {
            return res.status(HTTP.UNAUTHORIZED).json(ErrorResponse(HTTP.UNAUTHORIZED, 'Unauthorized'))
        }
    } catch (error) {
        console.log("Something went wrong on auth middleware: " , error)
        return res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, 'Internal Server Error'))
    }
}