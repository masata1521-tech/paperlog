export type DoiMetadata = {
  title: string | null;
  authors: string | null;
  journal: string | null;
  volume: string | null;
  issue: string | null;
  year: number | null;
  pages: string | null;
};

type CrossrefAuthor = { given?: string; family?: string };
type CrossrefMessage = {
  title?: string[];
  author?: CrossrefAuthor[];
  "container-title"?: string[];
  volume?: string;
  issue?: string;
  page?: string;
  published?: { "date-parts"?: number[][] };
  "published-print"?: { "date-parts"?: number[][] };
  "published-online"?: { "date-parts"?: number[][] };
};

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

// CrossRef sometimes returns HTML-escaped text and inline markup (<i>, <sub>, ...).
function cleanText(value: string | null | undefined): string | null {
  if (value == null) return null;
  const cleaned = value
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, (match, dec, hex, name) => {
      if (name) return NAMED_ENTITIES[name.toLowerCase()] ?? match;
      const code = dec ? parseInt(dec, 10) : parseInt(hex, 16);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    })
    .trim();
  return cleaned || null;
}

function formatAuthors(authors: CrossrefAuthor[] | undefined): string | null {
  if (!authors || authors.length === 0) return null;
  return authors
    .map((author) => {
      const family = cleanText(author.family) ?? undefined;
      const given = cleanText(author.given) ?? undefined;
      const initials = given
        ? given
            .split(/\s+/)
            .map((part) => part[0]?.toUpperCase())
            .join("")
        : "";
      return [family, initials].filter(Boolean).join(" ");
    })
    .filter(Boolean)
    .join(", ");
}

function extractYear(message: CrossrefMessage): number | null {
  const dateParts =
    message.published?.["date-parts"]?.[0] ??
    message["published-print"]?.["date-parts"]?.[0] ??
    message["published-online"]?.["date-parts"]?.[0];
  return dateParts?.[0] ?? null;
}

export async function fetchDoiMetadata(doi: string): Promise<DoiMetadata | null> {
  const cleanDoi = doi.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
  if (!cleanDoi) return null;

  const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { message?: CrossrefMessage };
  const message = data.message;
  if (!message) return null;

  return {
    title: cleanText(message.title?.[0]),
    authors: formatAuthors(message.author),
    journal: cleanText(message["container-title"]?.at(-1)),
    volume: message.volume ?? null,
    issue: message.issue ?? null,
    year: extractYear(message),
    pages: message.page ?? null,
  };
}
