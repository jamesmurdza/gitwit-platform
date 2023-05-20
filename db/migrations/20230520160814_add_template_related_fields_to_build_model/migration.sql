-- AlterEnum
ALTER TYPE "BuildType" ADD VALUE 'TEMPLATE';

-- AlterTable
ALTER TABLE "Build" ADD COLUMN     "templateGitURL" TEXT;
