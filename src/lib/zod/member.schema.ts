import { z } from "zod";

export const createMemberSchema = z.object({
	name: z.string().min(1, "Name is required"),
	role: z.string().min(1, "Role is required"),
	year: z.union([
		z.string().min(1, "Year is required"),
		z.number()
	]),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
