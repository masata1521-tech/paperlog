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

function formatAuthors(authors: CrossrefAuthor[] | undefined): string | null {
  if (!authors || authors.length === 0) return null;
  return authors
    .map(({ family, given }) => {
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
    title: message.title?.[0] ?? null,
    authors: formatAuthors(message.author),
    journal: message["container-title"]?.[0] ?? null,
    volume: message.volume ?? null,
    issue: message.issue ?? null,
    year: extractYear(message),
    pages: message.page ?? null,
  };
}
