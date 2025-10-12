"use client";

import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";

export default function Upgrade() {
  const upgrade = async () => {
    await authClient.checkout({
      products: [
        "db57bf53-3858-4ebd-8d11-74134380af46",
        "c0e47337-c574-4cb0-a5c0-afa5af91d4e2",
        "36046c5f-1ac6-4639-af91-a76bd740656d",
      ]
    });
  }
  return (
      <Button 
        variant="outline" 
        size="sm" 
        className="ml-2 cursor-pointer text-orange-400"
        onClick={upgrade}
      >
        Upgrade
      </Button>
  );
}