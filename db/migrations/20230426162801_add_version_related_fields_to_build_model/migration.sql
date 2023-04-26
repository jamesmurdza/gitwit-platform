-- AlterTable
ALTER TABLE "Build" ADD COLUMN     "isCurrentVersion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isInitialVersion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "outputGitURL" TEXT,
ADD COLUMN     "outputHTMLURL" TEXT,
ADD COLUMN     "parentVersionId" INTEGER,
ADD COLUMN     "userInput" TEXT;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_parentVersionId_fkey" FOREIGN KEY ("parentVersionId") REFERENCES "Build"("id") ON DELETE SET NULL ON UPDATE CASCADE;
