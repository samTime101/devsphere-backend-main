import prisma from "@/db/prisma";
import { prismaSafe } from "@/lib/prismaSafe";
import type { Member } from "@/types/member.types";
import { updateMemberSchema } from "@/lib/zod/member.schema";

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

    async updateMember(memberId: string, updates: Partial<Member>){
        try {
            let modifiedUpdates = { ...updates };

            const cleanData = Object.fromEntries(
                Object.entries(modifiedUpdates).filter(([_, v]) => v !== undefined && v !== null)
            );

            if (Object.keys(cleanData).length === 0) {
                return { success: false, error: "No valid fields provided for update" };
            }

            const [error, result] = await prismaSafe(
            prisma.member.update({
                where: { id: memberId },
                data: cleanData,
            })
            );

            if (error) return { success: false, error };
            if (!result) return { success: false, error: "Failed to update member" };

            return { success: true, data: result };
        } catch (error) {
            console.log(`Failed to update member, ${error}`);
            return { success: false, error };
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
            console.log(`Failed to fetch members, ${error}`)
            return {success : false, error : error}
        }
    }
}

export const memberServices = new MemberServices()