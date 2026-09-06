export type ParsedCitation = {
  authors: string | null;
  title: string | null;
  journal: string | null;
  volume: string | null;
  issue: string | null;
  year: number | null;
  pages: string | null;
};

const DOI_REGEX = /\bdoi:?\s*(10\.\d{4,9}\/[^\s,;]+)/i;

export function extractDoiFromText(text: string): string | null {
  const match = text.match(DOI_REGEX);
  if (!match) return null;
  return match[1].replace(/[.,;]+$/, "");
}

const YEAR_VOL_ISSUE_PAGES_REGEX =
  /(\d{4})\s*(?:[A-Za-z]{3,9}(?:-[A-Za-z]{3,9})?)?\s*;\s*(\d+)?\s*(?:\((\w+)\))?\s*:\s*([\d]+(?:[-–][\d]+)?)/;

export function parseCitationText(rawText: string): ParsedCitation {
  const text = rawText.trim().replace(/\s+/g, " ");
  const result: ParsedCitation = {
    authors: null,
    title: null,
    journal: null,
    volume: null,
    issue: null,
    year: null,
    pages: null,
  };
  if (!text) return result;

  const bibMatch = text.match(YEAR_VOL_ISSUE_PAGES_REGEX);
  if (bibMatch) {
    result.year = Number(bibMatch[1]);
    result.volume = bibMatch[2] ?? null;
    result.issue = bibMatch[3] ?? null;
    result.pages = bibMatch[4] ?? null;
  }

  const leading = bibMatch ? text.slice(0, bibMatch.index).trim() : text;
  const sentences = leading
    .split(". ")
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean);

  if (bibMatch && sentences.length >= 2) {
    result.journal = sentences[sentences.length - 1];
    result.authors = sentences[0];
    result.title = sentences.slice(1, -1).join(". ") || null;
  } else if (sentences.length >= 1) {
    result.authors = sentences[0];
    result.title = sentences.slice(1).join(". ") || null;
  }

  return result;
}
