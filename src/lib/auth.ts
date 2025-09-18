import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../db/prisma";
import { customSession } from "better-auth/plugins";
import { userService } from "@/services/user.service";

export const auth = betterAuth({
	user: {
		modelName: "user",
		additionalFields: {
			name: {
				type: "string",
				required: false,
				input: false,
			},
			role: {
				type: "string",
				required: false,
				defaultValue: "MODERATOR",
				input: true,
			},
			memberId: {
				type: "string",
				required: false,
				input: true, 
			},
		},
	},
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string
		}
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
	plugins: [
		customSession(async ({ user }) => {
			const roles = await userService.getUserRole(user.id);
			const userWithRole = roles.data;
			return { userWithRole };
		})
	],
});