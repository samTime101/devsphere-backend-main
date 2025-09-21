import type { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../dtos/index.js";
import { HTTP } from "@/utils/constants.js";
import { projectServices } from "@/services/project.service.js";
import type { CreateProjectInput, UpdateProjectInput } from "@/lib/zod/project.schema.js";
import { getRepoNameFromGithubUrl } from "@/utils/github.js";

class ProjectController {
  async getAllProjects(req: Request, res: Response) {
    try {
      const projectResult = await projectServices.getAllProjects();

      if (!projectResult.success || !projectResult.data) {
        return res
          .status(HTTP.BAD_REQUEST)
          .json(ErrorResponse(HTTP.BAD_REQUEST, projectResult.error));
      }

      res.status(HTTP.OK).json(SuccessResponse(HTTP.OK, "Fetched Sucessfully", projectResult));
    } catch (error) {
      console.error("Error in getAllProjects controller:", error);
      res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, "Internal Server Error"));
    }
  }

  async addProject(req: Request, res: Response) {
    try {
      const {
        name,
        githubLink,
        demoLink,
        thumbnailUrl,
        description,
        techStacks,
        tagIds,
      }: CreateProjectInput = req.body;

      let repoName = getRepoNameFromGithubUrl(githubLink);

      const addProjectResult = await projectServices.createProject(
        {
          name,
          githubLink,
          demoLink,
          description,
          thumbnailUrl,
          techStacks,
          tagIds,
        },
        repoName
      );

      if (!addProjectResult.success || !addProjectResult.data) {
        return res
          .status(HTTP.BAD_REQUEST)
          .json(
            ErrorResponse(
              HTTP.BAD_REQUEST,
              typeof addProjectResult.error === "string"
                ? addProjectResult.error
                : "Failed to add project"
            )
          );
      }
      return res
        .status(HTTP.OK)
        .json(SuccessResponse(HTTP.OK, "Project added successfully", addProjectResult.data));
    } catch (error) {
      console.error("Error in addProject controller:", error);
      return res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, "Internal Server Error"));
    }
  }

  async updateProject(req: Request, res: Response) {
    try {
      const projectId = req.params.id;
      const updates: UpdateProjectInput = req.body;

      const updateProjectResult = await projectServices.updateProject(projectId, updates);

      if (!updateProjectResult.success || !updateProjectResult.data) {
        return res
          .status(HTTP.BAD_REQUEST)
          .json(
            ErrorResponse(HTTP.BAD_REQUEST, updateProjectResult.error || "Failed to update project")
          );
      }
      return res
        .status(HTTP.OK)
        .json(SuccessResponse(HTTP.OK, "Project updated successfully", updateProjectResult.data));
    } catch (error) {
      console.error("Error in updating project:", error);
      res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, "Internal Server Error"));
    }
  }

  async deleteProject(req: Request, res: Response) {
    try {
      const projectId = req.params.id;

      const deleteProjectResult = await projectServices.deleteProject(projectId);

      if (!deleteProjectResult.success) {
        return res
          .status(HTTP.BAD_REQUEST)
          .json(
            ErrorResponse(HTTP.BAD_REQUEST, deleteProjectResult.error || "Failed to delete project")
          );
      }
      return res
        .status(HTTP.OK)
        .json(SuccessResponse(HTTP.OK, "Project deleted successfully", null));
    } catch (error) {
      console.error("Error in deleting project:", error);
      res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, "Internal Server Error"));
    }
  }
}

export const projectController = new ProjectController();
