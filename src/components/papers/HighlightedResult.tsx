import { splitStats } from "@/lib/paper-utils";

export function HighlightedResult({ text }: { text: string | null }) {
  if (!text) return null;
  const parts = splitStats(text);

  return (
    <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-700">
      {parts.map((part, i) =>
        part.isStat ? (
          <code
            key={i}
            className="mx-0.5 rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-indigo-700"
          >
            {part.text}
          </code>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </p>
  );
}
