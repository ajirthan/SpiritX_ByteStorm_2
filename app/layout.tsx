import "../styles/globals.css";
import ClientProviders from "@/components/ClientProviders";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "SecureConnect & Spirit11",
  description: "Secure authentication and fantasy cricket platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <Navbar />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
