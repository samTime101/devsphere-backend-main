import { ErrorResponse, SuccessResponse } from "@/dtos";
import { memberServices } from "@/services/member.service";
import { HTTP } from "@/utils/constants";
import type { Request, Response } from "express";

class MemberController{
    async createMember(req : Request, res : Response){
        try {
            const {name,role,year}  = req.body;
            if(!name || !role || !year){
                return res.status(400).json(ErrorResponse(400, 'Name, Roll and Year are required'));
            }
            const result = await memberServices.createMember({name,role,year});
            if (!result.success) {
                return res.status(400).json(ErrorResponse(400, typeof result.error === 'string' ? result.error : 'Failed to create member'));
            }
            if(result.success) {
                return res.status(201).json(SuccessResponse(201, 'Member created successfully', result));
            }
        } catch (error) {
            return res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, (error as Error).message || 'Internal Server Error'));
        }
    }
}

export const memberController = new MemberController()