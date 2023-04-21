/*
  Warnings:

  - The `status` column on the `Build` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `buildType` on the `Build` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
