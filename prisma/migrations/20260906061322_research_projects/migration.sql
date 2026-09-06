/*
  Warnings:

  - You are about to drop the `Collection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PaperCollections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PaperCollections" DROP CONSTRAINT "_PaperCollections_A_fkey";

-- DropForeignKey
ALTER TABLE "_PaperCollections" DROP CONSTRAINT "_PaperCollections_B_fkey";

-- DropTable
DROP TABLE "Collection";

-- DropTable
DROP TABLE "_PaperCollections";

-- CreateTable
CREATE TABLE "ResearchProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PaperResearchProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PaperResearchProjects_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PaperResearchProjects_B_index" ON "_PaperResearchProjects"("B");

-- AddForeignKey
ALTER TABLE "_PaperResearchProjects" ADD CONSTRAINT "_PaperResearchProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaperResearchProjects" ADD CONSTRAINT "_PaperResearchProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
