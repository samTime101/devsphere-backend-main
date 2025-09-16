import prisma from "@/db/prisma";
import { prismaSafe } from "@/lib/prismaSafe";
import type { Member } from "@/types/member.types";
import { success } from "zod";

class MemberServices{
    async createMember(member: Member){
        try {
            const [memberError, memberResult] = await prismaSafe(
                prisma.member.create({
                    data: {
                        status : 'ACTIVE',
                        ...member
                    }

                })
            )
            if(memberError) {
                return {success:false, error:memberError};
            }
        if(!memberResult) {
            return {success:false, error:'Failed to create member'}
        }
            return {success : true, data:memberResult}
         } catch (error) {
            console.log(`Failed to create Member, ${error}`)
            return {success : false, error: error}
        }

    }
    async removeMember(memberId: string){
        try {
            const [error,result] = await prismaSafe(
                prisma.member.update({
                    where : {
                        id :memberId
                    },
                    data : {
                        status : 'INACTIVE'
                    }
                })
            )
            if(error) return {success : false, error:error};
            if(!result) return {success : false,error : 'Failed to remove member'}
            
            return {success : true, data : result}
            
        } catch (error) {
            console.log(`Failed to remove member, ${error}`)
            return {success: false, error : error}
        }
    }

    async getMemberStatus(memberId : string){
        try {
            const[error,result] = await prismaSafe(
                prisma.member.findUnique({
                    where : {
                        id : memberId
                    },
                    select : {
                        status : true
                    }
                })
            )
            if(error) return {success : false, error:error};
            if(!result) return {success : false,error : 'Failed to check status'}
            
            return{success : true,data : result}
        } catch (error) {
            console.log(`Failed to check status, ${error}`)
            return {success: false, error : error} 
        }
    }

    async getMembers(){
        try {
            const [error, result] = await prismaSafe(
                prisma.member.findMany()
            )
            if (error) return { success: false, error };
            if (!result) return { success: false, error: "Failed to fetch members" };
            return { success: true, data: result };
        } catch (error) {
            console.log(`Failed to fecth members, ${error}`)
            return {success : false, error : error}
        }
    }
}

export const memberServices = new MemberServices()