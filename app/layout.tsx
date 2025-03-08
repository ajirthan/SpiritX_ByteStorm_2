import "../styles/globals.css";
import ClientProviders from "@/components/ClientProviders";

export const metadata = {
  title: "SecureConnect",
  description: "A secure and user-friendly authentication system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}