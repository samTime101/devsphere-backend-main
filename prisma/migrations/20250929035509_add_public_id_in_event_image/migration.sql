/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `event_images` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."event_images" DROP COLUMN "deleted_at",
ADD COLUMN     "public_id" TEXT;
