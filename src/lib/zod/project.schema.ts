import { z } from "zod";

export const createProjectSchema = z
  .object({
    id: z.string({ message: "Project ID is required" }).min(1, "Project ID is required").optional(),

    name: z.string({ message: "Project name is required" }).min(1, "Project name is required"),

    githubLink: z
      .string({ message: "GitHub link is required" })
      .url("Invalid GitHub link")
      .min(1, "GitHub link is required"),

    demoLink: z
      .string({ message: "Demo link is required" })
      .url("Invalid demo link")
      .min(1, "Demo link is required")
      .optional(),

    description: z.string({ message: "Description is required" }).min(1, "Description is required"),

    // techStacks: z
    //   .array(z.string({ message: "Tech stack must be a string" }))
    //   .min(1, "At least one tech stack is required"),
    techStacks: z.preprocess((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    }, z.array(z.string({ message: "Tech stack must be a string" })).min(1, "At least one tech stack is required")),

    // tagIds: z.array(z.string({ message: "Tag ID must be a string" })).optional(),
    tagIds: z.preprocess((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    }, z.array(z.string({ message: "Tag ID must be a string" })).optional()),
  })
  .strict();

export const projectIdParamsSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectIdParams = z.infer<typeof projectIdParamsSchema>;
