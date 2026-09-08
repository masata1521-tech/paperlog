"use client";

import { useActionState, useRef, useState } from "react";
import type { Paper } from "@/types/paper";
import { createPaper, updatePaper, lookupDoi, type PaperFormState } from "@/app/papers/actions";
import { extractDoiFromText, parseCitationText } from "@/lib/citation-parser";

const STUDY_DESIGNS = [
  "Randomized controlled trial",
  "Cross-sectional study",
  "Cohort study",
  "Case-control study",
  "Systematic review",
  "Meta-analysis",
  "Case report",
];

export function PaperForm({
  existingTags,
  projects,
  paper,
}: {
  existingTags: string[];
  projects: { id: string; title: string }[];
  paper?: Paper;
}) {
  const [state, formAction, isPending] = useActionState<PaperFormState, FormData>(
    paper ? updatePaper : createPaper,
    null
  );

  const titleRef = useRef<HTMLInputElement>(null);
  const authorsRef = useRef<HTMLInputElement>(null);
  const journalRef = useRef<HTMLInputElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);
  const issueRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const pagesRef = useRef<HTMLInputElement>(null);
  const doiRef = useRef<HTMLInputElement>(null);
  const citationRef = useRef<HTMLTextAreaElement>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupMessage, setLookupMessage] = useState<{ type: "error" | "success"; text: string } | null>(
    null
  );

  const handleCitationParse = async () => {
    const citationText = citationRef.current?.value ?? "";
    if (!citationText.trim()) {
      setLookupMessage({ type: "error", text: "引用文献を貼り付けてください" });
      return;
    }

    const local = parseCitationText(citationText);
    const doi = extractDoiFromText(citationText);

    setIsLookingUp(true);
    setLookupMessage(null);
    try {
      const crossref = doi ? await lookupDoi(null, doi) : null;
      const data = crossref && "data" in crossref ? crossref.data : null;

      if (doi && doiRef.current) doiRef.current.value = doi;
      if (titleRef.current) titleRef.current.value = data?.title ?? local.title ?? titleRef.current.value;
      if (authorsRef.current)
        authorsRef.current.value = data?.authors ?? local.authors ?? authorsRef.current.value;
      if (journalRef.current)
        journalRef.current.value = data?.journal ?? local.journal ?? journalRef.current.value;
      if (volumeRef.current)
        volumeRef.current.value = data?.volume ?? local.volume ?? volumeRef.current.value;
      if (issueRef.current) issueRef.current.value = data?.issue ?? local.issue ?? issueRef.current.value;
      if (yearRef.current)
        yearRef.current.value = String(data?.year ?? local.year ?? yearRef.current.value ?? "");
      if (pagesRef.current) pagesRef.current.value = data?.pages ?? local.pages ?? pagesRef.current.value;

      if (crossref && "error" in crossref) {
        setLookupMessage({
          type: "success",
          text: "DOIが見つからなかったため、貼り付けた文献情報のみでフォームを更新しました",
        });
      } else {
        setLookupMessage({ type: "success", text: "取得した情報でフォームを更新しました" });
      }
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleDoiLookup = async () => {
    const doi = doiRef.current?.value ?? "";
    setIsLookingUp(true);
    setLookupMessage(null);
    try {
      const result = await lookupDoi(null, doi);
      if (result && "error" in result) {
        setLookupMessage({ type: "error", text: result.error });
      } else if (result && "data" in result) {
        const { data } = result;
        if (data.title && titleRef.current) titleRef.current.value = data.title;
        if (data.authors && authorsRef.current) authorsRef.current.value = data.authors;
        if (data.journal && journalRef.current) journalRef.current.value = data.journal;
        if (data.volume && volumeRef.current) volumeRef.current.value = data.volume;
        if (data.issue && issueRef.current) issueRef.current.value = data.issue;
        if (data.year && yearRef.current) yearRef.current.value = String(data.year);
        if (data.pages && pagesRef.current) pagesRef.current.value = data.pages;
        setLookupMessage({ type: "success", text: "取得した情報でフォームを更新しました" });
      }
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      {paper && <input type="hidden" name="id" value={paper.id} />}
      {state?.error && (
        <div className="rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-4 py-2.5 text-sm text-red-700 dark:text-red-300">
          {state.error}
        </div>
      )}

      <section className="space-y-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
        <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">書誌情報</h2>
        <Field
          label="引用文献を貼り付け"
          hint="論文サイトなどに載っている引用文献をそのまま貼り付けると、DOIを見つけてCrossRefから情報を取得しつつ、取得できなかった項目は貼り付けた文献から補完します"
        >
          <div className="flex gap-2">
            <textarea
              ref={citationRef}
              rows={2}
              className={inputClass}
              placeholder="Kang MH, Lee DK, ... J Sport Rehabil. 2015 Feb;24(1):62-7. doi: 10.1123/jsr.2013-0117."
            />
            <button
              type="button"
              onClick={handleCitationParse}
              disabled={isLookingUp}
              className="shrink-0 self-start rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
            >
              {isLookingUp ? "取得中..." : "解析して入力"}
            </button>
          </div>
        </Field>
        <Field label="DOI" hint="入力して「自動入力」を押すと、タイトル・著者などを取得します">
          <div className="flex gap-2">
            <input
              ref={doiRef}
              name="doi"
              defaultValue={paper?.doi ?? ""}
              className={inputClass}
              placeholder="10.xxxx/xxxxx"
            />
            <button
              type="button"
              onClick={handleDoiLookup}
              disabled={isLookingUp}
              className="shrink-0 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
            >
              {isLookingUp ? "取得中..." : "自動入力"}
            </button>
          </div>
          {lookupMessage && (
            <span
              className={`mt-1 block text-xs ${
                lookupMessage.type === "error" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {lookupMessage.text}
            </span>
          )}
        </Field>
        <Field label="タイトル" required>
          <input
            ref={titleRef}
            name="title"
            required
            defaultValue={paper?.title}
            className={inputClass}
            placeholder="論文タイトル"
          />
        </Field>
        <Field label="著者" required>
          <input
            ref={authorsRef}
            name="authors"
            required
            defaultValue={paper?.authors}
            className={inputClass}
            placeholder="Smith J, Tanaka K, et al."
          />
        </Field>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Field label="ジャーナル">
              <input
                ref={journalRef}
                name="journal"
                defaultValue={paper?.journal ?? ""}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="巻">
            <input
              ref={volumeRef}
              name="volume"
              defaultValue={paper?.volume ?? ""}
              className={inputClass}
              placeholder="12"
            />
          </Field>
          <Field label="号">
            <input
              ref={issueRef}
              name="issue"
              defaultValue={paper?.issue ?? ""}
              className={inputClass}
              placeholder="3"
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="発表年">
            <input
              ref={yearRef}
              name="year"
              type="number"
              defaultValue={paper?.year ?? ""}
              className={inputClass}
              placeholder="2024"
            />
          </Field>
          <Field label="ページ">
            <input
              ref={pagesRef}
              name="pages"
              defaultValue={paper?.pages ?? ""}
              className={inputClass}
              placeholder="123-145"
            />
          </Field>
        </div>
        <Field label="本文URL" hint="DOIが無い場合や、PDF・全文へのリンクを保存したいときに">
          <input
            name="url"
            type="url"
            defaultValue={paper?.url ?? ""}
            className={inputClass}
            placeholder="https://..."
          />
        </Field>
      </section>

      <section className="space-y-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
        <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">研究内容</h2>
        <Field label="研究概要" hint="この研究が何を調べたかを2〜3行で">
          <textarea
            name="summary"
            rows={3}
            defaultValue={paper?.summary ?? ""}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="対象" hint="例: 健常成人 42名 / 平均年齢 24.3±3.2歳">
            <textarea
              name="subjects"
              rows={2}
              defaultValue={paper?.subjects ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="方法(研究デザイン)">
            <input
              name="studyDesign"
              list="study-designs"
              defaultValue={paper?.studyDesign ?? ""}
              className={inputClass}
            />
            <datalist id="study-designs">
              {STUDY_DESIGNS.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </Field>
        </div>
        <Field label="評価項目" hint="カンマ区切りで複数入力できます 例: Fukuda stepping test, VOR, COP">
          <input name="outcomes" defaultValue={paper?.outcomes ?? ""} className={inputClass} />
        </Field>
        <Field label="主な結果" hint="p値や相関係数は「p = 0.013」のように書くと検索結果で強調表示されます">
          <textarea
            name="mainResults"
            rows={3}
            defaultValue={paper?.mainResults ?? ""}
            className={inputClass}
          />
        </Field>
      </section>

      <section className="space-y-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
        <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">自分の研究との関連</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="関連度">
            <select
              name="relevanceRating"
              defaultValue={paper?.relevanceRating?.toString() ?? ""}
              className={inputClass}
            >
              <option value="">未評価</option>
              <option value="5">★★★★★</option>
              <option value="4">★★★★☆</option>
              <option value="3">★★★☆☆</option>
              <option value="2">★★☆☆☆</option>
              <option value="1">★☆☆☆☆</option>
            </select>
          </Field>
          <Field label="使い道ラベル" hint="カンマ区切り 例: 背景に使えそう, 方法の参考">
            <input
              name="usageLabels"
              defaultValue={paper?.usageLabels.join(", ") ?? ""}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="メモ">
          <textarea
            name="relevanceNote"
            rows={2}
            defaultValue={paper?.relevanceNote ?? ""}
            className={inputClass}
          />
        </Field>
        <Field
          label="タグ"
          hint={`カンマ区切り${existingTags.length > 0 ? ` 例: ${existingTags.slice(0, 5).join(", ")}` : ""}`}
        >
          <input
            name="tags"
            list="existing-tags"
            defaultValue={paper?.tags.map((t) => t.name).join(", ") ?? ""}
            className={inputClass}
          />
          <datalist id="existing-tags">
            {existingTags.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </Field>
        <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          <input
            type="checkbox"
            name="isAiSummary"
            defaultChecked={paper?.isAiSummary}
            className="size-4 rounded accent-indigo-600"
          />
          この研究概要・結果はAIが要約したものである
        </label>
      </section>

      {projects.length > 0 && (
        <section className="space-y-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
          <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">研究プロジェクト</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {projects.map((project) => (
              <label key={project.id} className="flex items-center gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                <input
                  type="checkbox"
                  name="projectIds"
                  value={project.id}
                  defaultChecked={paper?.researchProjects.some((p) => p.id === project.id)}
                  className="size-4 rounded accent-indigo-600"
                />
                {project.title}
              </label>
            ))}
          </div>
        </section>
      )}

      <div className="flex justify-end gap-2">
        {!paper && (
          <button
            type="submit"
            name="continueAdding"
            value="1"
            disabled={isPending}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
          >
            {isPending ? "保存中..." : "登録して続けて追加"}
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-neutral-900 dark:bg-neutral-100 px-5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 dark:text-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
        >
          {isPending ? "保存中..." : paper ? "変更を保存" : "論文を登録"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
        {required && <span className="ml-0.5 text-red-500 dark:text-red-400">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-neutral-400 dark:text-neutral-500">{hint}</span>}
    </label>
  );
}
