interface TagData {
  id: string;
  name: string;
}

interface ProjectContributor {
  id: string;
  name: string;
  avatarUrl: string | null;
  githubUsername: string | null;
}

export interface GetAllProjects {
  id: string;
  name: string;
  githubLink: string | null;
  demoLink: string | null;
  tech_stack: string[];
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags: TagData[];
  contributors: ProjectContributor[];
}
