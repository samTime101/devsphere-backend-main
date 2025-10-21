/*
  Warnings:

  - You are about to drop the column `techStacks` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "techStacks",
ADD COLUMN     "tech_stacks" TEXT[];
