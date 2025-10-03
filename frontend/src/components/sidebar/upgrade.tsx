"use client";

import { Button } from "../ui/button";

export default function Upgrade() {
    return (
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2 cursor-pointer text-orange-400"
        >
          Upgrade
        </Button>
    );
}