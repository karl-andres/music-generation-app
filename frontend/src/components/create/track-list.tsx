"use client";

import { Loader2, RefreshCcw, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";

export interface Track {
    id: string;
    title: string | null;
    createdAt: Date;
    instrumental: boolean;
    prompt: string | null;
    lyrics: string | null;
    describedLyrics: string | null;
    fullDescribedSong: string | null;
    thumbnailUrl: string | null;
    playUrl: string | null;
    status: string | null;
    createdByUsername: string | null;
    published: boolean;
}

export function TrackList({ tracks }: { tracks: Track[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);

    return (
         <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex-1 p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="relative max-w-md flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="pl-10" />
                    </div>
                    <Button disabled={isRefreshing} variant="outline" size="sm" onClick={() => {}}>{isRefreshing ? <Loader2 className="mr-2 animate-spin" /> : <RefreshCcw className="mr-2" />}Refresh</Button>
                </div>
            </div>
         </div>
    )
}