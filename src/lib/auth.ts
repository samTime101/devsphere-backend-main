import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../db/prisma";
import { createAuthMiddleware, customSession } from "better-auth/plugins";
import { userService } from "@/services/user.service";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true
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
			const userWithRole = roles.data
			return { userWithRole };
		})
	],
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			if (ctx.path === "/sign-up/email") {
				const body = ctx.body;  
				const newSession = ctx.context.newSession;

				if (newSession && body.role) {
					await prisma.user.update({
						where: { id: newSession.user.id },
						data: { role: body.role },
					});
				}
			}
		}),
	},
});