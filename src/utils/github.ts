export const getRepoNameFromGithubUrl = (url: string): string => {
  const regex = /github\.com\/([^/]+)\/([^/]+)/;
  const match = url.match(regex);

  if (match) {
    return match[2]; // Repo name is in the second capture group
  } else {
    throw new Error("Invalid GitHub URL");
  }
};
