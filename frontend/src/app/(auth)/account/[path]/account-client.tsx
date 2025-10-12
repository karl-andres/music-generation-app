"use client";

import { AccountView } from "@daveyplate/better-auth-ui";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export default function AccountClient({ path }: { path: string }) {
  const router = useRouter();

  return (
    <div className="container flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <Button className="self-start" variant="outline" onClick={() => router.back()}>
        <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
      </Button>
      <AccountView path={path} />
    </div>
  );
}