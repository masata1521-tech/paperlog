"use server";

import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCurrentUserId } from "@/lib/current-user";

function optionalStr(value: FormDataEntryValue | null): string | null {
  const str = String(value ?? "").trim();
  return str.length > 0 ? str : null;
}

export type ProjectFormState = { error: string } | null;

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const userId = await requireCurrentUserId();
  const title = optionalStr(formData.get("title"));
  if (!title) {
    return { error: "プロジェクト名は必須です" };
  }
  const description = optionalStr(formData.get("description"));

  const project = await prisma.researchProject.create({
    data: { title, description, userId },
  });

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function updateProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const userId = await requireCurrentUserId();
  const id = String(formData.get("id") ?? "");
  const title = optionalStr(formData.get("title"));
  if (!id || !title) {
    return { error: "プロジェクト名は必須です" };
  }
  const description = optionalStr(formData.get("description"));

  const existing = await prisma.researchProject.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!existing) notFound();

  await prisma.researchProject.update({
    where: { id },
    data: { title, description },
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  redirect(`/projects/${id}`);
}

export async function deleteProject(id: string) {
  const userId = await requireCurrentUserId();
  await prisma.researchProject.deleteMany({ where: { id, userId } });
  revalidatePath("/projects");
  redirect("/projects");
}

export async function addPaperToProject(projectId: string, formData: FormData) {
  const userId = await requireCurrentUserId();
  const paperId = String(formData.get("paperId") ?? "");
  if (!paperId) return;

  const [project, paper] = await Promise.all([
    prisma.researchProject.findFirst({ where: { id: projectId, userId }, select: { id: true } }),
    prisma.paper.findFirst({ where: { id: paperId, userId }, select: { id: true } }),
  ]);
  if (!project || !paper) return;

  await prisma.researchProject.update({
    where: { id: projectId },
    data: { papers: { connect: { id: paperId } } },
  });
  revalidatePath(`/projects/${projectId}`);
}

export async function removePaperFromProject(projectId: string, paperId: string) {
  const userId = await requireCurrentUserId();
  const project = await prisma.researchProject.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  });
  if (!project) return;

  await prisma.researchProject.update({
    where: { id: projectId },
    data: { papers: { disconnect: { id: paperId } } },
  });
  revalidatePath(`/projects/${projectId}`);
}
