-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE_DEVELOPMENT', 'MAINTENANCE', 'COMPLETED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "project_status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE_DEVELOPMENT';
