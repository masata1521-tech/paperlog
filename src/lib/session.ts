export const SESSION_COOKIE_NAME = "paperlog_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + padding);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmacSign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toBase64Url(new Uint8Array(signature));
}

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return secret;
}

export async function createSessionToken(userId: string): Promise<string> {
  const secret = getSecret();
  const payload = JSON.stringify({
    userId,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  });
  const encodedPayload = toBase64Url(new TextEncoder().encode(payload));
  const signature = await hmacSign(secret, encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null;
  const secret = getSecret();
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = await hmacSign(secret, encodedPayload);
  if (expectedSignature !== signature) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload))) as {
      userId?: string;
      exp?: number;
    };
    if (typeof payload.userId !== "string" || typeof payload.exp !== "number") return null;
    if (Date.now() > payload.exp) return null;
    return payload.userId;
  } catch {
    return null;
  }
}
