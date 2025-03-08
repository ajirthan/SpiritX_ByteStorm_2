// lib/email.tsx
import { render } from "@react-email/render";
import EmailTemplate from "@/components/EmailTemplate";

export async function resendVerificationEmail(username: string, token: string) {
  // Render the email template to HTML using JSX
  const emailHtml = render(<EmailTemplate username={username} token={token} />);

  const res = await fetch("https://api.resend.com/email", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "noreply@yourdomain.com",
      to: username, // Ideally, the email address
      subject: "Verify your email",
      html: emailHtml,
    }),
  });

  return res.json();
}
