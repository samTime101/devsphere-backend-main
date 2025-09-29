/*
  Warnings:

  - A unique constraint covering the columns `[github_username]` on the table `contributors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[project_id,contributor_id]` on the table `project_contributors` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "contributors_github_username_key" ON "public"."contributors"("github_username");

-- CreateIndex
CREATE UNIQUE INDEX "project_contributors_project_id_contributor_id_key" ON "public"."project_contributors"("project_id", "contributor_id");
