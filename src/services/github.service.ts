import prisma from '@/db/prisma';
import { prismaSafe } from '@/lib/prismaSafe';
import type { GithubContributor } from '@/types/github.types';
import axios from 'axios';

class GithubServices {
  async fetchContributors(
    repoName: string
  ): Promise<{ success: boolean; data?: GithubContributor[]; error?: string }> {
    try {
      const token = process.env.GITHUB_TOKEN;
      if (!token) {
        console.log('No github token found');
        return { success: false, error: 'No GitHub token found' };
      }
      const repositoryResponse = await axios.get(
        `https://api.github.com/repos/BIC-Devsphere/${repoName}/contributors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-GitHub-Api-Version': '2022-11-28',
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
        return { success: false, error: 'No contributors found' };
      }

      return { success: true, data: repositoryResponse.data };
    } catch (error) {
      return { success: false, error: 'Internal Server error' };
    }
  }

  async fetchContributorDetail(githubUsername: string) {
    try {
      const contributorResponse = await axios.get(`https://api.github.com/users/${githubUsername}`);
      console.log('Contributor detail', contributorResponse.data);
      return { success: true, data: contributorResponse.data };
    } catch (error) {
      return { success: false, error: error };
    }
  }
}

export const githubServices = new GithubServices();
