"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";

export type AuthFormState = { error: string } | null;

async function setSessionCookie(userId: string) {
  const token = await createSessionToken(userId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function signup(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim() || null;

  if (!email || !password) {
    return { error: "メールアドレスとパスワードは必須です" };
  }
  if (password.length < 8) {
    return { error: "パスワードは8文字以上にしてください" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "このメールアドレスはすでに登録されています" };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, passwordHash, name } });

  await setSessionCookie(user.id);
  redirect("/dashboard");
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "") || "/dashboard";

  if (!email || !password) {
    return { error: "メールアドレスとパスワードを入力してください" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "メールアドレスまたはパスワードが違います" };
  }

  await setSessionCookie(user.id);
  redirect(from);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
