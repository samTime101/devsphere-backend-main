import { z } from "zod";

export const createUserSchema = z.object({
    email: z
        .string({ message: "Email is required" })
        .email("Invalid email format")
        .min(1, "Email is required"),

    password: z
        .string({ message: "Password is required" })
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),

    name: z
        .string({ message: "Name is required" })
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters"),
    role: z
        .enum(["ADMIN", "MODERATOR"])
        .optional()
        .default("MODERATOR"),

    memberId: z
        .string({ message: "Member Id is required" })
        .uuid("Invalid member ID format")
});

export const updateUserRoleSchema = z.object({
    role: z.enum(["ADMIN", "MODERATOR"])
});

export const userParamsSchema = z.object({
    id: z.string().uuid("Invalid user ID format")
});

export const getUsersQuerySchema = z.object({
    page: z
        .string()
        .regex(/^\d+$/, "Page must be a positive number")
        .transform(Number)
        .refine(val => val > 0, "Page must be greater than 0")
        .optional()
        .default(1),

    limit: z
        .string()
        .regex(/^\d+$/, "Limit must be a positive number")
        .transform(Number)
        .refine(val => val > 0 && val <= 100, "Limit must be between 1 and 100")
        .optional()
        .default(10),

    role: z
        .enum(["ADMIN", "MODERATOR"])
        .optional(),

    search: z
        .string()
        .min(1, "Search term must not be empty")
        .optional()
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UserParamsInput = z.infer<typeof userParamsSchema>;
export type GetUsersQueryInput = z.infer<typeof getUsersQuerySchema>;
