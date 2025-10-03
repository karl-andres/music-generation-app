import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import CreateSong from "~/components/create";
import { SongPanel } from "~/components/create/song-panel";
import { Suspense } from "react";
import TrackListFetcher from "~/components/create/track-list-fetcher";
import { Loader2 } from "lucide-react";

export default async function CreatePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("auth/sign-in");
  }
  
  return (
    <div className="flex h-full flex-col lg:flex-row">
        <SongPanel />
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
          <TrackListFetcher />
        </Suspense>
    </div>
  );
}
