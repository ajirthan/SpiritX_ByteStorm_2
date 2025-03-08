import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function resendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;
  await resend.emails.send({
    from: "noreply@techlooom.com",
    to: email,
    subject: "Verify Your Email",
    html: `<p>Click the link below to verify your email:</p>
           <a href="${verificationLink}">Verify Email</a>`,
  });
}

export async function resendResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;
  await resend.emails.send({
    from: "norepy@techlooom.com",
    to: email,
    subject: "Reset Your Password",
    html: `<p>Click the link below to reset your password. This link expires in 10 minutes:</p>
           <a href="${resetLink}">Reset Password</a>`,
  });
}
