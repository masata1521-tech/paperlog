"use client";

import { useActionState } from "react";
import {
  createProject,
  updateProject,
  type ProjectFormState,
} from "@/app/projects/actions";

export function ProjectForm({
  project,
}: {
  project?: { id: string; title: string; description: string | null };
}) {
  const [state, formAction, isPending] = useActionState<ProjectFormState, FormData>(
    project ? updateProject : createProject,
    null
  );

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      {project && <input type="hidden" name="id" value={project.id} />}
      {state?.error && (
        <div className="rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-4 py-2.5 text-sm text-red-700 dark:text-red-300">
          {state.error}
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          プロジェクト名<span className="ml-0.5 text-red-500 dark:text-red-400">*</span>
        </span>
        <input
          name="title"
          required
          defaultValue={project?.title}
          placeholder="例: 足踏み検査 × ハンガー反射"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">研究テーマ・メモ</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={project?.description ?? ""}
          placeholder="このプロジェクトで何を明らかにしたいか、背景など"
          className={inputClass}
        />
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-neutral-900 dark:bg-neutral-100 px-5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 dark:text-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
        >
          {isPending ? "保存中..." : project ? "変更を保存" : "プロジェクトを作成"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900";
