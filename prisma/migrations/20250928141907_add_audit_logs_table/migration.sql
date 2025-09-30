-- CreateEnum
CREATE TYPE "public"."ActionType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "public"."Models" AS ENUM ('USER', 'MEMBER', 'EVENT', 'PROJECT', 'PROJECTCONTRIBUTORS', 'EVENTSCHEDULE', 'CONTRIBUTOR', 'TAG');

-- CreateEnum
CREATE TYPE "public"."EventImageType" AS ENUM ('PROMOTIONAL', 'GALLERY', 'GUESTS');

-- CreateTable
CREATE TABLE "public"."event_images" (
    "id" TEXT NOT NULL,
    "image_url" TEXT,
    "image_type" "public"."EventImageType" NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "event_id" TEXT NOT NULL,

    CONSTRAINT "event_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLogs" (
    "id" TEXT NOT NULL,
    "action" "public"."ActionType" NOT NULL DEFAULT 'CREATE',
    "userId" TEXT NOT NULL,
    "entity" "public"."Models" NOT NULL,
    "entityId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changes" JSONB,

    CONSTRAINT "AuditLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLogs_timestamp_idx" ON "public"."AuditLogs"("timestamp");

-- CreateIndex
CREATE INDEX "AuditLogs_userId_idx" ON "public"."AuditLogs"("userId");

-- CreateIndex
CREATE INDEX "AuditLogs_entity_entityId_idx" ON "public"."AuditLogs"("entity", "entityId");

-- AddForeignKey
ALTER TABLE "public"."event_images" ADD CONSTRAINT "event_images_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLogs" ADD CONSTRAINT "AuditLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
