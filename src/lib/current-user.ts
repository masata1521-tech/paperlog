import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function requireCurrentUserId(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }
  return userId;
}
