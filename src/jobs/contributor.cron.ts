import { contributorServices } from '@/services/contributor.service';
import { githubServices } from '@/services/github.service';
import { projectServices } from '@/services/project.service';
import { getRepoNameFromGithubUrl } from '@/utils/github';
import cron from 'node-cron';

/**
 * Contributor Cron Job
 *
 * Runs daily at midnight
 *
 * Workflow
 * 1. Fetch all projects
 * 2. For each project:
 *   - Fetch contributors from GitHub
 *   - Check the difference between remote and db contributors
 *   - If new contributor exists, then add them to the project
 */

const contributorCron = async () => {
  try {
    console.log('Starting the CRON JOB');
    const projectsInDatabase = await projectServices.getAllProjects();

    if (!projectsInDatabase.success || !projectsInDatabase.data) {
      console.log('No Projects found');
      return;
    }
    console.log('All Projects', projectsInDatabase);

    for (const project of projectsInDatabase.data) {
      if (!project.githubLink) {
        console.log(`Skipping project ${project.name} as it has no GitHub link`);
        // return;
        continue;
      }
      const repoName = getRepoNameFromGithubUrl(project.githubLink);
      const projectGithubContributors = await githubServices.fetchContributors(repoName);

      console.log('Working for the repo', repoName);
      if (!projectGithubContributors.data) {
        console.log('Data not found for the repo', repoName);
        // return;
        continue;
      }

      const githubContributorsUsername = projectGithubContributors.data.map((c) => c.login);
      const dbContributorsUsername = project.contributors.map((c) => c.githubUsername);

      // Find the new contributors based on difference between contributors from github and saved in db
      const newContributors = githubContributorsUsername
        .filter((login) => !dbContributorsUsername.includes(login))
        .map((login) => ({ login }));

      if (newContributors.length === 0) {
        console.log('No new contributor activity found for the repo: ', repoName);
        // return;
        continue;
      }

      console.log('New contributors found!!!!!!', newContributors);

      // Add new contributor
      if (repoName) {
        const result = await contributorServices.addNewGithubContributorsToProject(
          newContributors,
          project.id
        );
        console.log(`Result for project ${project.name}:`, result);
        if (!result.success) {
          console.error(`Failed to add contributors for project ${project.name}:`, result.error);
        } else {
          console.log(`Successfully added contributors for project ${project.name}`);
        }
      } else {
        console.error(`Invalid GitHub URL for project ${project.name}: ${project.githubLink}`);
      }
    }
  } catch (error) {
    console.log('Error in doing the job', error);
  }
};

export const startContributorCron = () => {
  cron.schedule('0 0 * * *', contributorCron);
  console.log('Contributor cron job scheduled');
};
