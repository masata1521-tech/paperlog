"use server";

import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { splitList } from "@/lib/paper-utils";
import { requireCurrentUserId } from "@/lib/current-user";
import { fetchDoiMetadata, type DoiMetadata } from "@/lib/crossref";

export async function toggleFavorite(id: string) {
  const userId = await requireCurrentUserId();
  const paper = await prisma.paper.findFirst({ where: { id, userId } });
  if (!paper) return;
  await prisma.paper.update({
    where: { id },
    data: { isFavorite: !paper.isFavorite },
  });
  revalidatePath("/papers");
  revalidatePath(`/papers/${id}`);
}

export async function toggleRead(id: string) {
  const userId = await requireCurrentUserId();
  const paper = await prisma.paper.findFirst({ where: { id, userId } });
  if (!paper) return;
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
    volume: optionalStr(formData.get("volume")),
    issue: optionalStr(formData.get("issue")),
    year,
    pages: optionalStr(formData.get("pages")),
    doi: optionalStr(formData.get("doi")),
    url: optionalStr(formData.get("url")),
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
  const userId = await requireCurrentUserId();
  const { title, authors, tagNames, projectIds, ...fields } = extractPaperFields(formData);
  if (!title || !authors) {
    return { error: "タイトルと著者は必須です" };
  }

  const ownedProjects = await prisma.researchProject.findMany({
    where: { id: { in: projectIds }, userId },
    select: { id: true },
  });

  let paperId: string;
  try {
    const paper = await prisma.paper.create({
      data: {
        title,
        authors,
        ...fields,
        userId,
        tags: {
          connectOrCreate: tagNames.map((name) => ({
            where: { userId_name: { userId, name } },
            create: { name, userId },
          })),
        },
        researchProjects: {
          connect: ownedProjects.map((p) => ({ id: p.id })),
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
  if (formData.get("continueAdding")) {
    redirect("/papers/new?created=1");
  }
  redirect(`/papers/${paperId}`);
}

export async function updatePaper(
  _prevState: PaperFormState,
  formData: FormData
): Promise<PaperFormState> {
  const userId = await requireCurrentUserId();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { error: "不正なリクエストです" };
  }

  const existing = await prisma.paper.findFirst({ where: { id, userId }, select: { id: true } });
  if (!existing) notFound();

  const { title, authors, tagNames, projectIds, ...fields } = extractPaperFields(formData);
  if (!title || !authors) {
    return { error: "タイトルと著者は必須です" };
  }

  const ownedProjects = await prisma.researchProject.findMany({
    where: { id: { in: projectIds }, userId },
    select: { id: true },
  });

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
            where: { userId_name: { userId, name } },
            create: { name, userId },
          })),
        },
        researchProjects: {
          set: ownedProjects.map((p) => ({ id: p.id })),
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

export type DoiLookupState = { error: string } | { data: DoiMetadata } | null;

export async function lookupDoi(
  _prevState: DoiLookupState,
  doi: string
): Promise<DoiLookupState> {
  const trimmed = doi.trim();
  if (!trimmed) {
    return { error: "DOIを入力してください" };
  }
  try {
    const data = await fetchDoiMetadata(trimmed);
    if (!data || (!data.title && !data.authors)) {
      return { error: "この DOI の情報が見つかりませんでした" };
    }
    return { data };
  } catch {
    return { error: "取得に失敗しました。しばらくしてからもう一度お試しください" };
  }
}

export async function deletePaper(id: string) {
  const userId = await requireCurrentUserId();
  await prisma.paper.deleteMany({ where: { id, userId } });
  revalidatePath("/papers");
  redirect("/papers");
}
