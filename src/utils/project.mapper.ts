import type { GetAllProjects } from '@/types/project.types';
import { Prisma, type Project } from '@prisma/client';

type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    ProjectTags: { select: { tag: true } };
    ProjectContributors: {
      select: {
        contributor: {
          select: {
            id: true;
            name: true;
            avatarUrl: true;
            githubUsername: true;
          };
        };
      };
    };
  };
}>;

export const mapProjects = (projects: ProjectWithRelations[]) => {
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    githubLink: project.githubLink,
    demoLink: project.demoLink,
    thumbnailUrl: project.thumbnailUrl,
    tech_stack: project.techStacks,
    description: project.description,
    tags: project.ProjectTags.map((pt) => pt.tag),
    contributors: project.ProjectContributors.map((pc) => pc.contributor),
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }));
};
