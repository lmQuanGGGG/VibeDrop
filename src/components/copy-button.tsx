"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type CopyButtonProps = {
  promptId: string;
  promptText: string;
};

import { CopyCheck } from "lucide-react";

export function CopyButton({ promptId, promptText }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(promptText);
    await fetch(`/api/prompts/${promptId}/copy`, { method: "POST" });
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      onClick={onCopy}
      className={`flex items-center gap-1 py-1.5 px-3 rounded-none transition-all duration-150 font-display font-black text-[9px] uppercase tracking-wider cursor-pointer border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none ${
        copied
          ? 'bg-green-100 text-black'
          : 'bg-white hover:bg-neutral-100 text-black'
      }`}
    >
      {copied ? (
        <>
          <CopyCheck className="w-3" />
          <span>COPIED</span>
        </>
      ) : (
        <>
          <Copy className="w-3" />
          <span>COPY</span>
        </>
      )}
    </button>
  );
}
