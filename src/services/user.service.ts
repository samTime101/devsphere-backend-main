import prisma from "@/db/prisma";
import { prismaSafe } from "@/lib/prismaSafe";

class UserService {
    async getUserRole(userId: string) {
        try {
            const [error, user] = await prismaSafe(
                prisma.user.findUnique({
                    where: {
                        id: userId
                    }
                })
            )
            if (error) {
                return {success: false, error}
            }
            return {success: true, data: user}

        } catch (error) {
            console.log("Something went wrong when fetching user role: ", error)
            return {success: false, message: "something went wrong"};
        }
    }

    async getAllUsers(options?: { page?: number; limit?: number; role?: string; search?: string }) {
        try {
            const { page = 1, limit = 10, role, search } = options || {};
            const skip = (page - 1) * limit;

            const where: any = {};
            if (role) {
                where.role = role;
            }
            if (search) {
                where.OR = [
                    { email: { contains: search, mode: 'insensitive' } }
                ];
            }

            const [countError, totalCount] = await prismaSafe(
                prisma.user.count({ where })
            );

            if (countError) {
                return { success: false, error: countError };
            }

            const [error, users] = await prismaSafe(
                prisma.user.findMany({
                    where,
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        memberId: true,
                        emailVerified: true,
                        createdAt: true,
                        updatedAt: true,
                        member: {
                            select: {
                                name: true,
                                role: true,
                                year: true,
                                status: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    skip,
                    take: limit
                })
            );
            
            if (error) {
                return { success: false, error };
            }

            const totalPages = Math.ceil((Number(totalCount) || 0) / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;

            return { 
                success: true, 
                data: {
                    users,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalCount,
                        hasNextPage,
                        hasPrevPage,
                        limit
                    }
                }
            };
        } catch (error) {
            console.log("Something went wrong when fetching all users: ", error);
            return { success: false, message: "something went wrong" };
        }
    }

    async getUserById(userId: string) {
        try {
            const [error, user] = await prismaSafe(
                prisma.user.findUnique({
                    where: { id: userId },
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        memberId: true,
                        emailVerified: true,
                        createdAt: true,
                        updatedAt: true,
                        member: {
                            select: {
                                name: true,
                                role: true,
                                year: true,
                                status: true
                            }
                        }
                    }
                })
            );
            
            if (error) {
                return { success: false, error };
            }
            return { success: true, data: user };
        } catch (error) {
            console.log("Something went wrong when fetching user by id: ", error);
            return { success: false, message: "something went wrong" };
        }
    }

    async updateUserRole(userId: string, role: string) {
        try {
            const [error, user] = await prismaSafe(
                prisma.user.update({
                    where: { id: userId },
                    data: { role: role as any },
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        memberId: true,
                        emailVerified: true,
                        updatedAt: true
                    }
                })
            );
            
            if (error) {
                return { success: false, error };
            }
            return { success: true, data: user };
        } catch (error) {
            console.log("Something went wrong when updating user role: ", error);
            return { success: false, message: "something went wrong" };
        }
    }
}

export const userService = new UserService()