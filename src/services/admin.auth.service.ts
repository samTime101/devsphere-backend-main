import { prismaSafe } from '../lib/prismaSafe.ts';
import { hashPassword, comparePassword } from '../lib/password.js';
import { signJwt } from '../lib/jwt.js';
import prisma from '../db/prisma.js';

interface CreateAdminUserData {
    email: string;
    password: string;
    memberId?: string;
}

interface AdminUserResponse {
    id: string;
    email: string;
    role: string;
    memberId: string | null;
    createdAt: Date;
    member?: {
        id: string;
        name: string;
        role: string;
        year: Date;
    } | null;
}

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export class AdminAuthService {
    async createAdminUser(userData: CreateAdminUserData): Promise<{ success: boolean; error?: string; data?: { user: AdminUserResponse; tokens: AuthTokens } }> {
        try {
            const { email, password, memberId } = userData;

            const hashedPassword = await hashPassword(password);

            const [error, user] = await prismaSafe(
                prisma.user.create({
                    data: {
                        email: email.toLowerCase().trim(),
                        password: hashedPassword,
                        role: 'ADMIN',
                        memberId: memberId || null,
                    },
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        memberId: true,
                        createdAt: true,
                        member: {
                            select: {
                                id: true,
                                name: true,
                                role: true,
                                year: true,
                            }
                        }
                    }
                })
            );

            if (error) {
                return { success: false, error };
            }

            if (!user) {
                return { success: false, error: 'Failed to create user' };
            }

            const tokens = this.generateTokens(user.id, user.email);

            return { success: true, data: { user, tokens } };
        } catch (error) {
            console.log(`Failed to create admin user, ${error}`);
            return { success: false, error: error as string };
        }
    }

    async findAdminByEmail(email: string): Promise<{ success: boolean; error?: string; data?: AdminUserResponse }> {
        try {
            const [error, user] = await prismaSafe(
                prisma.user.findUnique({
                    where: {
                        email: email.toLowerCase().trim(),
                        role: 'ADMIN'
                    },
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        memberId: true,
                        createdAt: true,
                        member: {
                            select: {
                                id: true,
                                name: true,
                                role: true,
                                year: true,
                            }
                        }
                    }
                })
            );

            if (error) {
                return { success: false, error };
            }

            if (!user) {
                return { success: false, error: 'Admin user not found' };
            }

            return { success: true, data: user };
        } catch (error) {
            console.log(`Failed to find admin by email, ${error}`);
            return { success: false, error: error as string };
        }
    }

    private generateTokens(userId: string, email: string): AuthTokens {
        const accessToken = signJwt(
            { sub: userId, email },
            '15m'
        );

        const refreshToken = signJwt(
            { sub: userId, email },
            '7d',
            process.env.JWT_REFRESH_SECRET!
        );

        return { accessToken, refreshToken };
    }
}

export default new AdminAuthService();
