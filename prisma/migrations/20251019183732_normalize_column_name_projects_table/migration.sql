/*
  Warnings:

  - You are about to drop the column `tech_stack` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "tech_stack",
ADD COLUMN     "techStacks" TEXT[];
