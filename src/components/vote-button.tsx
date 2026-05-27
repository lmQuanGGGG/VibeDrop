"use client";

import { useState, useTransition } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type VoteButtonProps = {
  promptId: string;
  initialScore: number;
  initialValue: number | null;
};

export function VoteButton({
  promptId,
  initialScore,
  initialValue,
}: VoteButtonProps) {
  const [score, setScore] = useState(initialScore);
  const [value, setValue] = useState(initialValue ?? 0);
  const [isPending, startTransition] = useTransition();

  const submitVote = (nextValue: number) => {
    const resolved = value === nextValue ? 0 : nextValue;

    startTransition(async () => {
      const response = await fetch(`/api/prompts/${promptId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: resolved }),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        return;
      }

      const delta = resolved - value;
      setScore((prev) => prev + delta);
      setValue(resolved);
    });
  };

  return (
    <div className="flex items-center gap-2 border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white rounded-none">
      <button
        className={`p-1 hover:bg-neutral-100 transition-colors cursor-pointer ${value === 1 ? "text-red-500" : "text-black"}`}
        onClick={() => submitVote(1)}
        disabled={isPending}
      >
        <ArrowBigUp className={`w-4 h-4 ${value === 1 ? "fill-current" : ""}`} />
      </button>
      
      <span className="font-mono text-[10px] font-black w-6 text-center">{score}</span>
      
      <button
        className={`p-1 hover:bg-neutral-100 transition-colors cursor-pointer ${value === -1 ? "text-blue-500" : "text-black"}`}
        onClick={() => submitVote(-1)}
        disabled={isPending}
      >
        <ArrowBigDown className={`w-4 h-4 ${value === -1 ? "fill-current" : ""}`} />
      </button>
    </div>
  );
}
