"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) return null;

  const user = session.user as { id: string; role: string; name?: string };

  // Admin and user navigation links
  const adminLinks = [
    { name: "Players", href: "/admin/players" },
    { name: "Player Stats", href: "/admin/stats" },
    { name: "Tournament Summary", href: "/admin/tournament-summary" },
  ];

  const userLinks = [
    { name: "Players", href: "/user/players" },
    { name: "Select Team", href: "/user/select-team" },
    { name: "Team", href: "/user/team" },
    { name: "Budget", href: "/user/budget" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Spiriter", href: "/spiriter" },
  ];

  const links = user.role === "admin" ? adminLinks : userLinks;

  return (
    <nav className="w-full bg-primary text-light py-4 shadow">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() =>
            router.push(
              user.role === "admin" ? "/admin/players" : "/user/select-team"
            )
          }
        >
          SecureConnect
        </div>
        <ul className="flex space-x-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>
                <span className="hover:underline">{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="hover:underline"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
