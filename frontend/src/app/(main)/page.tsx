import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("auth/sign-in");
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <p>Dashboard</p>
    </main>
  );
}
