export function splitList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[,\n、]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const STAT_PATTERN = /\b([rpn]|95%\s?CI)\s?[<>=≈]\s?[-\d.,\s]+%?/gi;

export function splitStats(text: string | null | undefined): {
  text: string;
  isStat: boolean;
}[] {
  if (!text) return [];
  const parts: { text: string; isStat: boolean }[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(STAT_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, index), isStat: false });
    }
    parts.push({ text: match[0], isStat: true });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isStat: false });
  }
  return parts;
}
