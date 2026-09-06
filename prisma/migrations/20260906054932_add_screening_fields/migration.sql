-- AlterTable
ALTER TABLE "Paper" ADD COLUMN     "isAiSummary" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "relevanceNote" TEXT,
ADD COLUMN     "relevanceRating" INTEGER,
ADD COLUMN     "usageLabels" TEXT[] DEFAULT ARRAY[]::TEXT[];
