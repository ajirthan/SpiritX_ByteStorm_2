// app/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  } else {
    const userRole = (session.user as { role: string }).role;
    // Redirect to the proper dashboard based on role
    if (userRole === "admin") {
      redirect("/admin/players");
    } else {
      redirect("/user/select-team");
    }
  }
}
