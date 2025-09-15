import { ErrorResponse, SuccessResponse } from "@/dtos";
import { memberServices } from "@/services/member.service";
import { HTTP } from "@/utils/constants";
import type { Request, Response } from "express";

class MemberController{
    async createMember(req : Request, res : Response){
        try {
            const {name,role,year}  = req.body;
            if(!name || !role || !year){
                const errorResponse = new ErrorResponse({
                    error : 'Name, Roll and Year are required',
                    code: 400
                });
                return res.status(400).json(errorResponse)
            }
            const result = await memberServices.createMember({name,role,year});
            if (!result.success) {
                const errorResponse = new ErrorResponse({
                    error: typeof result.error === 'string' ? result.error : 'Failed to create member',
                    code: 400
                });
                return res.status(400).json(errorResponse);
            }
            if(result.success) {
                const successResponse = new SuccessResponse({
                    data : result,
                    message : 'Member created successfully',
                    code : 201
                })
                return res.status(201).json(successResponse)
            }
        } catch (error) {
            const errorResponse = new ErrorResponse({
                error: (error as Error).message || 'Internal Server Error',
                code: HTTP.INTERNAL
            });
            return res.status(HTTP.INTERNAL).json(errorResponse);
        }
    }
}

export const memberController = new MemberController()