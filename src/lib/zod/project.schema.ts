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

    thumbnailUrl: z
      .string({ message: "Thumbnail URL is required" })
      .url("Invalid thumbnail URL")
      .min(1, "Thumbnail URL is required")
      .optional(),

    description: z.string({ message: "Description is required" }).min(1, "Description is required"),

    techStacks: z
      .array(z.string({ message: "Tech stack must be a string" }))
      .min(1, "At least one tech stack is required"),

    tagIds: z.array(z.string({ message: "Tag ID must be a string" })).optional(),
  })
  .strict();

export const updateProjectParamsSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UpdateProjectParams = z.infer<typeof updateProjectParamsSchema>;
