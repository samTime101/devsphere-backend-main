/*
  Warnings:

  - You are about to drop the column `contributorId` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `projects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_contributorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_tagId_fkey";

-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "contributorId",
DROP COLUMN "tagId";

-- CreateTable
CREATE TABLE "public"."project_tags" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "project_tags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."project_tags" ADD CONSTRAINT "project_tags_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_tags" ADD CONSTRAINT "project_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
