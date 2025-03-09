"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Define a type for our session user that includes the role.
type AdminUser = {
  id: string;
  name?: string | null;
  role: string;
};

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Cast session.user as AdminUser to check role
    if (!session?.user || (session.user as AdminUser).role !== "admin") {
      router.push("/login");
    }
  }, [session, router]);

  if (!session?.user || (session.user as AdminUser).role !== "admin")
    return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-sm bg-white rounded shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Admin Panel</h2>
        <div className="space-y-4">
          <Link href="/admin/players">
            <button className="w-full py-2 px-4 bg-primary text-light rounded hover:bg-secondary cursor-pointer">
              Manage Players
            </button>
          </Link>
          <Link href="/admin/stats">
            <button className="w-full py-2 px-4 bg-primary text-light rounded hover:bg-secondary cursor-pointer">
              View Player Stats
            </button>
          </Link>
          <Link href="/admin/tournament-summary">
            <button className="w-full py-2 px-4 bg-primary text-light rounded hover:bg-secondary cursor-pointer">
              Tournament Summary
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
