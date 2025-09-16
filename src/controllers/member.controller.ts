import { ErrorResponse, SuccessResponse } from "@/dtos";
import { memberServices } from "@/services/member.service";
import { HTTP } from "@/utils/constants";
import type { Request, Response } from "express";

class MemberController{
    async createMember(req : Request, res : Response){
        try {
            const {name,role,year}  = req.body;
            if(!name || !role || !year){
                return res.status(HTTP.BAD_REQUEST).json(ErrorResponse(HTTP.BAD_REQUEST, 'Name, Roll and Year are required'));
            }
            const result = await memberServices.createMember({name,role,year});
            if (!result.success) {
                return res.status(HTTP.BAD_REQUEST).json(ErrorResponse(HTTP.BAD_REQUEST, typeof result.error === 'string' ? result.error : 'Failed to create member'));
            }
            else {
                return res.status(HTTP.CREATED).json(SuccessResponse(HTTP.CREATED, 'Member created successfully', result));
            }
        } catch (error) {
            return res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, (error as Error).message || 'Internal Server Error'));
        }
    }
    
    async removeMembers(req:Request,res:Response){
        try {
            const memberId = req.params.id
            const result = await memberServices.getMemberStatus(memberId)
            if(!result.success){
                return res.status(HTTP.NOT_FOUND).json(ErrorResponse(HTTP.NOT_FOUND, 'Member not found'));
            }
            if(result.data?.status === 'INACTIVE'){
                return res.status(HTTP.CONFLICT).json(ErrorResponse(HTTP.CONFLICT,'Member is already inactive'))
            }

            const memberResult = await memberServices.removeMember(memberId)
            if(!memberResult.success){
                return res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, 'Failed to remove member'));
            }
            return res.status(HTTP.OK).json(SuccessResponse(HTTP.OK,`Successfully removed ${memberResult.data?.name}`))

        }
        catch (error) {
            return res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, (error as Error).message || 'Internal Server Error'));
        }
    }
}

export const memberController = new MemberController()