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
}

export const userService = new UserService()