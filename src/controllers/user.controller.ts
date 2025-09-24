import type { Request, Response } from "express";
import { auth } from "@/lib/auth";
import { userService } from "@/services/user.service";
import { ErrorResponse, SuccessResponse } from "@/dtos";
import { HTTP } from "@/utils/constants";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { email, password, name, role, memberId } = req.body;

        if (!email || !password) {
            return res.status(HTTP.BAD_REQUEST).json(
                ErrorResponse(HTTP.BAD_REQUEST, "Email and password are required")
            );
        }

        if (role && !["ADMIN", "MODERATOR"].includes(role)) {
            return res.status(HTTP.BAD_REQUEST).json(
                ErrorResponse(HTTP.BAD_REQUEST, "Invalid role. Must be ADMIN or MODERATOR")
            );
        }

        const result = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
                role: role || "MODERATOR",
                memberId
            }
        });

        if (result) {
            return res.status(HTTP.CREATED).json(
                SuccessResponse(HTTP.CREATED, "User created successfully", {
                    user: {
                        id: result.user.id,
                        email: result.user.email
                    }
                })
            );
        } else {
            return res.status(HTTP.BAD_REQUEST).json(
                ErrorResponse(HTTP.BAD_REQUEST, "Failed to create user")
            );
        }
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(HTTP.INTERNAL).json(
            ErrorResponse(HTTP.INTERNAL, "Internal server error")
        );
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { page, limit, role, search } = req.query as any;
        const users = await userService.getAllUsers({ page, limit, role, search });
        
        if (!users.success) {
            return res.status(HTTP.INTERNAL).json(
                ErrorResponse(HTTP.INTERNAL, users.message || "Failed to retrieve users")
            );
        }
        
        return res.status(HTTP.OK).json(
            SuccessResponse(HTTP.OK, "Users retrieved successfully", users.data)
        );
    } catch (error) {
        console.error("Error retrieving users:", error);
        return res.status(HTTP.INTERNAL).json(
            ErrorResponse(HTTP.INTERNAL, "Internal server error")
        );
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        
        if (!user) {
            return res.status(HTTP.NOT_FOUND).json(
                ErrorResponse(HTTP.NOT_FOUND, "User not found")
            );
        }
        
        return res.status(HTTP.OK).json(
            SuccessResponse(HTTP.OK, "User retrieved successfully", user)
        );
    } catch (error) {
        console.error("Error retrieving user:", error);
        return res.status(HTTP.INTERNAL).json(
            ErrorResponse(HTTP.INTERNAL, "Internal server error")
        );
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["ADMIN", "MODERATOR"].includes(role)) {
            return res.status(HTTP.BAD_REQUEST).json(
                ErrorResponse(HTTP.BAD_REQUEST, "Invalid role. Must be ADMIN or MODERATOR")
            );
        }

        const updatedUser = await userService.updateUserRole(id, role);
        
        if (!updatedUser) {
            return res.status(HTTP.NOT_FOUND).json(
                ErrorResponse(HTTP.NOT_FOUND, "User not found")
            );
        }
        
        return res.status(HTTP.OK).json(
            SuccessResponse(HTTP.OK, "User role updated successfully", updatedUser)
        );
    } catch (error) {
        console.error("Error updating user role:", error);
        return res.status(HTTP.INTERNAL).json(
            ErrorResponse(HTTP.INTERNAL, "Internal server error")
        );
    }
};
