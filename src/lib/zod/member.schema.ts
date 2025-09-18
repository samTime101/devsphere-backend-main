import { z } from "zod";

export const memberSchema = z.object({
  name: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
      return "Name is required";
      }
      if (issue.code === "invalid_type") {
        return "Name must be a string";
      }
      return undefined;
    },
  })
  .min(1, { message: "Name is required" }),

  role: z.string({
    error: (issue) => {
      if (issue.input === undefined) {
      return "Role is required";
      }
      if (issue.code === "invalid_type") {
        return "Role must be a string";
      }
      return undefined;
    },
  })
  .min(1, { message: "Role is required" }),

  year: z.preprocess(
    (val) =>
      typeof val === "string" || typeof val === "number"
        ? new Date(val)
        : val,
    z.date({
      error: (issue) => {
        if (issue.code === "invalid_type") {
          return "Year must be a valid date";
        }
        if (issue.code === "invalid_type" && issue.input === undefined) {
          return "Year is required";
        }
        return undefined;
      },
    })
  ),

  status: z.enum(["ACTIVE", "INACTIVE"], {
    error: "Status must be either ACTIVE or INACTIVE",
  }).optional(),
});

export const createMemberSchema = memberSchema;
export const updateMemberSchema = memberSchema.partial();

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
