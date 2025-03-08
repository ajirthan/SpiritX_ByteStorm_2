// components/EmailTemplate.tsx
import React from "react";

type Props = {
  username: string;
  token: string;
};

const EmailTemplate: React.FC<Props> = ({ username, token }) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;
  return (
    <div style={{ fontFamily: "sans-serif", color: "#27374d" }}>
      <h1>Welcome to SecureConnect!</h1>
      <p>Hello {username},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href={verificationUrl}>{verificationUrl}</a>
      <p>Thank you!</p>
    </div>
  );
};

export default EmailTemplate;
