import { z } from "zod";

export const createProjectSchema = z.object({
  id: z.string().min(1, "Project ID is required").optional(),
  name: z.string().min(1, "Project name is required"),
  githubLink: z.url("Invalid GitHub link").min(1, "GitHub link is required"),
  demoLink: z.url("Invalid demo link").min(1, "Demo link is required").optional(),
  thumbnailUrl: z.url("Invalid thumbnail URL").min(1, "Thumbnail URL is required").optional(),
  description: z.string().min(1, "Description is required"),
  techStacks: z.array(z.string()).min(1, "At least one tech stack is required"),
  tagIds: z.array(z.string()).optional(),
});

export const updateProjectParamsSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UpdateProjectParams = z.infer<typeof updateProjectParamsSchema>;
