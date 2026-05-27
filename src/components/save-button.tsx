"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

type SaveButtonProps = {
  promptId: string;
  initialSaved: boolean;
};

export function SaveButton({ promptId, initialSaved }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggleSave = () => {
    startTransition(async () => {
      const response = await fetch(`/api/prompts/${promptId}/save`, {
        method: saved ? "DELETE" : "POST",
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        return;
      }

      setSaved((prev) => !prev);
    });
  };

  return (
    <button
      onClick={toggleSave}
      disabled={isPending}
      className={`absolute top-4 right-4 z-20 p-2 border-2 border-black cursor-pointer transition-all active:translate-y-0.5 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none ${
        saved
          ? 'bg-black text-white'
          : 'bg-white hover:bg-neutral-100 text-black'
      } disabled:opacity-50`}
      title={saved ? "Saved" : "Save Vibe"}
    >
      <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
    </button>
  );
}
