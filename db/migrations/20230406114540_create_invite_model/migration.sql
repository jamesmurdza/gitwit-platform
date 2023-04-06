-- CreateTable
CREATE TABLE "Invite" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);
