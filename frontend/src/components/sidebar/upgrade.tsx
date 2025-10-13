"use client";

import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";

export default function Upgrade() {
  const upgrade = async () => {
    await authClient.checkout({
      products: [
        "a2e1beaf-d11c-489c-a255-fef4fb6de82b",
        "041c024d-aae7-42f5-8a0f-fab77e69e786",
        "72ce786b-77a6-4966-9619-29bd1dcd8fea",
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