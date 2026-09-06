"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { splitList } from "@/lib/paper-utils";

export async function toggleFavorite(id: string) {
  const paper = await prisma.paper.findUniqueOrThrow({ where: { id } });
  await prisma.paper.update({
    where: { id },
    data: { isFavorite: !paper.isFavorite },
  });
  revalidatePath("/papers");
  revalidatePath(`/papers/${id}`);
}

export async function toggleRead(id: string) {
  const paper = await prisma.paper.findUniqueOrThrow({ where: { id } });
  await prisma.paper.update({
    where: { id },
    data: { isRead: !paper.isRead },
  });
  revalidatePath("/papers");
  revalidatePath(`/papers/${id}`);
}

function optionalStr(value: FormDataEntryValue | null): string | null {
  const str = String(value ?? "").trim();
  return str.length > 0 ? str : null;
}

function extractPaperFields(formData: FormData) {
  const yearRaw = formData.get("year");
  const year = yearRaw && String(yearRaw).trim() ? Number(yearRaw) : null;
  const relevanceRatingRaw = formData.get("relevanceRating");
  const relevanceRating =
    relevanceRatingRaw && String(relevanceRatingRaw).trim()
      ? Number(relevanceRatingRaw)
      : null;

  return {
    title: optionalStr(formData.get("title")),
    authors: optionalStr(formData.get("authors")),
    journal: optionalStr(formData.get("journal")),
    year,
    doi: optionalStr(formData.get("doi")),
    studyDesign: optionalStr(formData.get("studyDesign")),
    subjects: optionalStr(formData.get("subjects")),
    summary: optionalStr(formData.get("summary")),
    outcomes: optionalStr(formData.get("outcomes")),
    mainResults: optionalStr(formData.get("mainResults")),
    relevanceRating,
    relevanceNote: optionalStr(formData.get("relevanceNote")),
    usageLabels: splitList(String(formData.get("usageLabels") ?? "")),
    isAiSummary: formData.get("isAiSummary") === "on",
    tagNames: splitList(String(formData.get("tags") ?? "")),
    projectIds: formData.getAll("projectIds").map(String),
  };
}

function isUniqueConstraintError(e: unknown): boolean {
  return (
    !!e &&
    typeof e === "object" &&
    "code" in e &&
    (e as { code?: string }).code === "P2002"
  );
}

export type PaperFormState = { error: string } | null;

export async function createPaper(
  _prevState: PaperFormState,
  formData: FormData
): Promise<PaperFormState> {
  const { title, authors, tagNames, projectIds, ...fields } = extractPaperFields(formData);
  if (!title || !authors) {
    return { error: "タイトルと著者は必須です" };
  }

  let paperId: string;
  try {
    const paper = await prisma.paper.create({
      data: {
        title,
        authors,
        ...fields,
        tags: {
          connectOrCreate: tagNames.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
        researchProjects: {
          connect: projectIds.map((id) => ({ id })),
        },
      },
    });
    paperId = paper.id;
  } catch (e) {
    if (isUniqueConstraintError(e)) {
      return { error: "このDOIはすでに登録されています" };
    }
    throw e;
  }

  revalidatePath("/papers");
  redirect(`/papers/${paperId}`);
}

export async function updatePaper(
  _prevState: PaperFormState,
  formData: FormData
): Promise<PaperFormState> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { error: "不正なリクエストです" };
  }

  const { title, authors, tagNames, projectIds, ...fields } = extractPaperFields(formData);
  if (!title || !authors) {
    return { error: "タイトルと著者は必須です" };
  }

  try {
    await prisma.paper.update({
      where: { id },
      data: {
        title,
        authors,
        ...fields,
        tags: {
          set: [],
          connectOrCreate: tagNames.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
        researchProjects: {
          set: projectIds.map((id) => ({ id })),
        },
      },
    });
  } catch (e) {
    if (isUniqueConstraintError(e)) {
      return { error: "このDOIはすでに登録されています" };
    }
    throw e;
  }

  revalidatePath("/papers");
  revalidatePath(`/papers/${id}`);
  redirect(`/papers/${id}`);
}

export async function deletePaper(id: string) {
  await prisma.paper.delete({ where: { id } });
  revalidatePath("/papers");
  redirect("/papers");
}
