-- CreateEnum
CREATE TYPE "BuildType" AS ENUM ('REPOSITORY', 'BRANCH');

-- CreateEnum
CREATE TYPE "BuildStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILURE');

-- CreateTable
CREATE TABLE "Build" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" INTEGER NOT NULL,
    "buildType" "BuildType" NOT NULL,
    "status" "BuildStatus" NOT NULL DEFAULT 'PENDING',
    "gptModel" TEXT,
    "gitwitVersion" TEXT,
    "buildLog" TEXT,
    "buildScript" TEXT,
    "baseImage" TEXT,

    CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
