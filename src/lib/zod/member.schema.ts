import { z } from "zod";

export const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  year: z.preprocess(
    (val) =>
      typeof val === "string" || typeof val === "number"
        ? new Date(val)
        : val,
    z.date()
  ),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const createMemberSchema = memberSchema;
export const updateMemberSchema = memberSchema.partial();

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
