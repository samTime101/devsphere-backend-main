import { prismaSafe } from '../lib/prismaSafe.js';
import { hashPassword, comparePassword } from '../lib/password.js';
import { signJwt } from '../lib/jwt.js';
import prisma from '../db/index.js';

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
    async createAdminUser(userData: CreateAdminUserData): Promise<[string | null, { user: AdminUserResponse; tokens: AuthTokens } | null]> {
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
            return [error, null];
        }

        if (!user) {
            return ['Failed to create user', null];
        }

        const tokens = this.generateTokens(user.id, user.email);

        return [null, { user, tokens }];
    }


    async findAdminByEmail(email: string): Promise<[string | null, AdminUserResponse | null]> {
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

        return [error, user];
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
