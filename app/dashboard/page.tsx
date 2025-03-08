// app/dashboard/page.tsx
"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
    }
  }, [session, router]);

  if (!session?.user) {
    // Optionally, you can return a loading spinner here.
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-light p-6"
    >
      <h1 className="text-4xl font-bold text-primary mb-4">
        Hello, {session.user.name}!
      </h1>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="py-2 px-4 bg-secondary text-light rounded hover:bg-primary transition-colors cursor-pointer"
      >
        Logout
      </button>
    </motion.div>
  );
}
