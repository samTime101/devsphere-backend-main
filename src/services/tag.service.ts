import prisma from "@/db/prisma";
import { prismaSafe } from "@/lib/prismaSafe";
import { success } from "zod";

class TagServices {
  async getAllTags() {
    try {
      const [error, result] = await prismaSafe(prisma.tag.findMany());

      if (error) {
        return { success: false, error: error };
      }

      if (!result) {
        return { success: false, error: "Failed to fetch tags" };
      }

      return { success: true, data: result };
    } catch (error) {
      console.log(`Failed to fetch tags, ${error}`);
      return { success: false, error: error };
    }
  }

  async createTag(name: string) {
    try {
      const [error, result] = await prismaSafe(
        prisma.tag.create({
          data: {
            name,
          },
        })
      );
      if (error) {
        return { success: false, error: error };
      }
      if (!result) {
        return { success: false, error: "Failed to create tag" };
      }
      return { success: true, data: result };
    } catch (error) {
      console.log(`Failed to create tag, ${error}`);
      return { success: false, error: error };
    }
  }

  async checkTagExists(id: string) {
    try {
      const [error, result] = await prismaSafe(
        prisma.tag.findUnique({
          where: {
            id,
          },
        })
      );
      if (error) {
        return { success: false, error: error };
      }
      if (!result) {
        return { success: false, error: "Tag does not exist" };
      }
      return { success: true, data: result };
    } catch (error) {
      console.log(`Failed to check tag existence, ${error}`);
      return { success: false, error: error };
    }
  }

  async associateTagToProject(projectId: string, tagIds: string[]) {
    try {
      const [tagError, tagResult] = await prismaSafe(
        prisma.projectTags.createMany({
          data: tagIds.map((tagId) => ({ projectId, tagId })),
          skipDuplicates: true,
        })
      );

      if (tagError) {
        console.log(`Error associating tag ${tagIds} with project ${projectId}: ${tagError}`);
        return { success: false, error: "Failed to associate tags with project" };
      }
      if (!tagResult) {
        console.log(`No result when associating tag ${tagIds} with project ${projectId}`);
        return { success: false, error: "Failed to associate tags with project" };
      }

      return { success: true, data: tagResult };
    } catch (error) {
      console.log(`Failed to associate tags with project ${projectId}, ${error}`);
      return { success: false, error: "Internal server error" };
    }
  }
}

export const tagServices = new TagServices();
