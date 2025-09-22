import prisma from "@/db/prisma";
import { prismaSafe } from "@/lib/prismaSafe";
import axios from "axios";

class GithubServices {
  async fetchContributors(repoName: string) {
    try {
      const token = process.env.GITHUB_TOKEN;
      if (!token) {
        console.log("No github token found");
        return;
      }
      const repositoryResponse = await axios.get(
        `https://api.github.com/repos/BIC-Devsphere/${repoName}/contributors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      const [error, contributors] = await prismaSafe(
        prisma.contributor.findMany({
          include: {
            ProjectContributors: {
              select: {
                projectId: true,
              },
            },
          },
        })
      );

      if (error) {
        return { success: false, error: error };
      }

      if (!contributors) {
        return { success: false, error: "No contributors found" };
      }

      return { success: true, data: repositoryResponse.data };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async fetchContributorDetail(githubUsername: string) {
    try {
      const contributorResponse = await axios.get(`https://api.github.com/users/${githubUsername}`);
      console.log("Contributor detail", contributorResponse.data);
      return { success: true, data: contributorResponse.data };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async checkContributorExistence(githubUsername: string) {
    try {
      const [error, contributorResult] = await prismaSafe(
        prisma.contributor.findFirst({
          where: {
            githubUsername: githubUsername,
          },
        })
      );

      if (error) {
        return { success: false, error: error };
      }

      if (!contributorResult) {
        return { success: false, error: "Could not find contributor" };
      }

      return { success: true, data: contributorResult };
    } catch (error) {
      return { success: false, error: error };
    }
  }
}

export const githubServices = new GithubServices();
