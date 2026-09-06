import { Resend } from "resend";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "PaperLog <onboarding@resend.dev>",
    to,
    subject: "PaperLog - パスワード再設定",
    html: `
      <p>PaperLogのパスワード再設定のリクエストを受け付けました。</p>
      <p>以下のリンクから新しいパスワードを設定してください(このリンクは1時間有効です)。</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>心当たりがない場合は、このメールを無視してください。</p>
    `,
  });
}
