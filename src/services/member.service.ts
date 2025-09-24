import prisma from "@/db/prisma";
import { prismaSafe } from "@/lib/prismaSafe";
import type { UpdateMemberInput,CreateMemberInput } from "@/lib/zod/member.schema";
import { uploadImageToCloudinary } from "@/utils/cloudinary.uploader";
import { profile } from "console";

class MemberServices{
    async createMember(member: CreateMemberInput , imageFile : Express.Multer.File | undefined){
        try {
            let profileImageUrl : string | null = null;
            
            if(imageFile){
                try {
                    const uploadResult = await uploadImageToCloudinary(imageFile.path,{
                        folder : "profile_images",
                    })
                    if(!uploadResult.success){
                        console.log(`Error while uploading image: ${uploadResult.error}`)
                    }
                    profileImageUrl = uploadResult.url ?? null
                    
                } catch (error) {
                    console.log(`Cloudinary upload error: ${error}`)
                }
            }

            const [memberError, memberResult] = await prismaSafe(
                prisma.member.create({
                    data: {
                        status : 'ACTIVE',
                        ...member,
                        avatarUrl : profileImageUrl,
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

    async updateMember(memberId: string, updates: UpdateMemberInput, imageFile : Express.Multer.File | undefined){
        try {

            let profileImageUrl : string | null = null;

            if(imageFile){
                try {
                    const uploadResult = await uploadImageToCloudinary(imageFile.path,{
                        folder : "profile_images",
                    })
                    if(!uploadResult.success){
                        console.log(`Error while uploading image: ${uploadResult.error}`)
                    }
                    profileImageUrl = uploadResult.url ?? null
                    
                } catch (error) {
                    console.log(`Cloudinary upload error: ${error}`)
                }
            }


            if (Object.keys(updates).length === 0 && !profileImageUrl) {
                return { success: false, error: "No valid fields provided for updates" };
            }

            const [error, result] = await prismaSafe(
            prisma.member.update({
                where: { id: memberId },
                data: {...updates, avatarUrl : profileImageUrl}
            })
            );

            if (error) return { success: false, error };
            if (!result) return { success: false, error: "Failed to updates member" };

            return { success: true, data: result };
        } catch (error) {
            console.log(`Failed to updates member, ${error}`);
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

    async getMembers({skip,limit}:{skip: number; limit: number}){
        try {
            const [error, result] = await prismaSafe(
                Promise.all([
                    prisma.member.findMany({
                        skip,
                        take : limit,
                        orderBy : { year : "desc"}
                    }),
                    prisma.member.count()
                ])
            )
            if (error) return { success: false, error : error };
            if (!result) return { success: false, error: "Failed to fetch members" };
            const [members, total] = result;
            return { success: true, data: {members, total} };
        } catch (error) {
            console.log(`Failed to fetch members, ${error}`)
            return {success : false, error : error}
        }
    }

    async getMember(memberId: string) {
        try {
            const [error, result] = await prismaSafe(
                prisma.member.findUnique({
                    where: { id: memberId },
                })
            );

            if (error) return { success: false, error };
            if (!result) return { success: false, error: "Member not found" };

            return { success: true, data: result };
        } catch (error) {
            console.log(`Failed to fetch member, ${error}`);
            return { success: false, error };
        }
    }
}

export const memberServices = new MemberServices()