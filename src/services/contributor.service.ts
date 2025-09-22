import prisma from "@/db/prisma";
import { prismaSafe } from "@/lib/prismaSafe";
import axios from "axios";
import { githubServices } from "./github.service";
import type { GithubContributor } from "@/types/github.types";

class ContributorServices {
  async addContributorToProject(contributorId: string, projectId: string) {
    try {
      const [error, contributorResult] = await prismaSafe(
        prisma.projectContributors.create({
          data: {
            contributorId: contributorId,
            projectId: projectId,
          },
        })
      );

      if (error) {
        return { success: false, error: error };
      }

      if (!contributorResult) {
        return { success: false, error: "Could not add contributor to project" };
      }

      return { success: true, data: contributorResult };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  /*
    Flow
    - Fetch all contributors for the repository.
    - Iterate through each contributor and check if they exists in the db
        - If yes, move forward
        - If no, populate the user's profile using github users API
    - Fetch the project id by using project name
    - Add contributorId and projectId
  */

  async addContributorsToProject(repoName: string, projectId: string) {
    try {
      const contributorResponse = await githubServices.fetchContributors(repoName);

      console.log("Fetched contributors", contributorResponse);
      if (!contributorResponse?.success || !contributorResponse.data) {
        return { success: false, error: contributorResponse?.error };
      }

      const results: { contributorId: string; login: string }[] = [];
      const errors: string[] = [];

      await Promise.allSettled(
        contributorResponse.data.map(async (contributor: GithubContributor) => {
          try {
            const existingContributor = await githubServices.checkContributorExistence(
              contributor.login
            );
            let contributorId: string;

            // If contributor does not exist, create a new one
            if (!existingContributor.success || !existingContributor.data) {
              const newContributorData = await githubServices.fetchContributorDetail(
                contributor.login
              );

              // Skip if we can't fetch contributor details
              if (!newContributorData || !newContributorData.success) {
                errors.push(`Failed to fetch contributor details: ${contributor.login}`);
                return;
              }

              const newContributor = await prisma.contributor.create({
                data: {
                  name: newContributorData.data.name || "Unknown",
                  avatarUrl: contributor.avatar_url,
                  githubUsername: contributor.login,
                },
              });

              // If new contributor is not created in database, skip for this one
              if (!newContributor) {
                errors.push(`Failed to create contributor: ${contributor.login}`);
                return;
              }

              // If new contributor is created in database, use its ID
              contributorId = newContributor.id;
            } else {
              // If contributor exists, use existing ID
              contributorId = existingContributor.data.id;
            }

            const contributorToProjectResult = await this.addContributorToProject(
              contributorId,
              projectId
            );

            if (!contributorToProjectResult.success) {
              errors.push(`Failed to add contributor to project: ${contributor.login}`);
              return;
            }

            // If everything is successful, push to results
            results.push({ contributorId, login: contributor.login });
          } catch (error) {
            errors.push(`Failed to add contributor to project: ${contributor.login}`);
          }
        })
      );
      return {
        success: errors.length === 0,
        data: results,
      };
    } catch (error) {
      console.error("Error adding contributors to project:", error);
      return { success: false, error: error };
    }
  }

  async getAllContributors() {
    try {
      const [error, contributors] = await prismaSafe(prisma.contributor.findMany());
      if (error) return { success: false, error: error };
      if (!contributors) return { success: false, error: "No contributors found" };

      return { success: true, data: contributors };
    } catch (error) {
      console.error("Error fetching all contributors:", error);
      return { success: false, error: error };
    }
  }
}

export const contributorServices = new ContributorServices();
