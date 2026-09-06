"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function optionalStr(value: FormDataEntryValue | null): string | null {
  const str = String(value ?? "").trim();
  return str.length > 0 ? str : null;
}

export type ProjectFormState = { error: string } | null;

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const title = optionalStr(formData.get("title"));
  if (!title) {
    return { error: "プロジェクト名は必須です" };
  }
  const description = optionalStr(formData.get("description"));

  const project = await prisma.researchProject.create({
    data: { title, description },
  });

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function updateProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const id = String(formData.get("id") ?? "");
  const title = optionalStr(formData.get("title"));
  if (!id || !title) {
    return { error: "プロジェクト名は必須です" };
  }
  const description = optionalStr(formData.get("description"));

  await prisma.researchProject.update({
    where: { id },
    data: { title, description },
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  redirect(`/projects/${id}`);
}

export async function deleteProject(id: string) {
  await prisma.researchProject.delete({ where: { id } });
  revalidatePath("/projects");
  redirect("/projects");
}

export async function addPaperToProject(projectId: string, formData: FormData) {
  const paperId = String(formData.get("paperId") ?? "");
  if (!paperId) return;
  await prisma.researchProject.update({
    where: { id: projectId },
    data: { papers: { connect: { id: paperId } } },
  });
  revalidatePath(`/projects/${projectId}`);
}

export async function removePaperFromProject(projectId: string, paperId: string) {
  await prisma.researchProject.update({
    where: { id: projectId },
    data: { papers: { disconnect: { id: paperId } } },
  });
  revalidatePath(`/projects/${projectId}`);
}
