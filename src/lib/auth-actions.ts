"use server";

import { randomBytes, createHash } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { requireCurrentUserId } from "@/lib/current-user";
import { sendPasswordResetEmail } from "@/lib/email";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";

export type AuthFormState = { error: string } | null;
export type ChangePasswordState = { error: string } | { success: true } | null;
export type RequestResetState = { error: string } | { success: true } | null;

const RESET_TOKEN_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

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

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const userId = await requireCurrentUserId();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "すべての項目を入力してください" };
  }
  if (newPassword.length < 8) {
    return { error: "新しいパスワードは8文字以上にしてください" };
  }
  if (newPassword !== confirmPassword) {
    return { error: "新しいパスワードが一致しません" };
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (!(await verifyPassword(currentPassword, user.passwordHash))) {
    return { error: "現在のパスワードが違います" };
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  return { success: true };
}

export async function requestPasswordReset(
  _prevState: RequestResetState,
  formData: FormData
): Promise<RequestResetState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    return { error: "メールアドレスを入力してください" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + RESET_TOKEN_MAX_AGE_MS),
      },
    });

    const headerList = await headers();
    const host = headerList.get("host");
    const protocol = host?.startsWith("localhost") ? "http" : "https";
    const resetUrl = `${protocol}://${host}/reset-password?token=${rawToken}`;

    await sendPasswordResetEmail(email, resetUrl);
  }

  // Always report success, whether or not the email exists, to avoid leaking
  // which addresses have an account.
  return { success: true };
}

export async function resetPassword(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const token = String(formData.get("token") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) {
    return { error: "リンクが無効です。もう一度パスワード再設定をリクエストしてください。" };
  }
  if (newPassword.length < 8) {
    return { error: "新しいパスワードは8文字以上にしてください" };
  }
  if (newPassword !== confirmPassword) {
    return { error: "パスワードが一致しません" };
  }

  const tokenHash = hashToken(token);
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return { error: "リンクの有効期限が切れています。もう一度パスワード再設定をリクエストしてください。" };
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.deleteMany({ where: { userId: resetToken.userId } }),
  ]);

  await setSessionCookie(resetToken.userId);
  redirect("/dashboard");
}
