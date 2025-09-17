import { ErrorResponse, SuccessResponse } from "@/dtos";
import { memberServices } from "@/services/member.service";
import { HTTP } from "@/utils/constants";
import { error } from "console";
import type { Request, Response } from "express";
import { success } from "zod";

class MemberController{
    async createMember(req : Request, res : Response){
        try {
            const {name,role,year}  = req.body;
            if(!name || !role || !year){
                return res.status(HTTP.BAD_REQUEST).json(ErrorResponse(HTTP.BAD_REQUEST, 'Name, Role and Year are required'));
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
    
    
    async getMembers(req : Request, res : Response){
        try {
            const result = await memberServices.getMembers()
            if(!result.success){
                return res.status(HTTP.NOT_FOUND).json(ErrorResponse(HTTP.NOT_FOUND,typeof result.error === 'string'? result.error : 'Failed to fetch members'))
            }

            return res.status(HTTP.OK).json(SuccessResponse(HTTP.OK,'Fetched successfully',result.data))

        } catch (error) {
            console.log(error)
            return res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, (error as Error).message || 'Internal Server Error'));
        }
    }

    async updateMember(req : Request, res : Response){

        try {
            const memberId = req.params.id
            const updates = req.body

            const result = await memberServices.updateMember(memberId, updates)
            if (!result.success){
                return res.status(HTTP.BAD_REQUEST).json({success:false,error:result.error})
            }
            return res.status(HTTP.OK).json({success:true,data:result.data})
        } catch (error) {
            console.log(`Update Member Controller Error: ${error}`)
            return res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, (error as Error).message || 'Internal Server Error'));
            
        }

    }
}

export const memberController = new MemberController()