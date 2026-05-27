"use client";

import Link from "next/link";
import { PromptWithStats } from "@/lib/queries/prompts";
import { MessageSquare, ArrowRight, Copy, Check } from "lucide-react";
import { useState } from "react";

export function PromptArchiveList({ prompts, emptyMessage }: { prompts: PromptWithStats[], emptyMessage: string }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <p className="font-mono text-xl font-bold uppercase">{emptyMessage}</p>
      </div>
    );
  }

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.preventDefault(); // Prevent link click
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full overflow-hidden">
      {/* Header Row */}
      <div className="hidden sm:grid grid-cols-12 gap-4 items-center px-4 py-3 border-b-4 border-black bg-neutral-100 font-mono text-xs font-black uppercase tracking-wider">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-7">Vibe & Title</div>
        <div className="col-span-2 text-center border-l-2 border-black pl-4">Stats</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* List Container */}
      <div className="divide-y-4 divide-black">
        {prompts.map((prompt, index) => {
          const hasImage = !!(prompt.thumbnail_url || prompt.image_url);

          return (
            <Link 
              key={prompt.id} 
              href={`/prompts/${prompt.id}`}
              className="group grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 bg-white hover:bg-[#c8f560]/10 transition-colors"
            >
              {/* Number (Hidden on Mobile) */}
              <div className="hidden sm:flex col-span-1 justify-center">
                <span className="font-display font-black text-2xl text-neutral-300 group-hover:text-black transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Title & Meta */}
              <div className="col-span-1 sm:col-span-7 flex flex-col sm:flex-row sm:items-center gap-3 w-full min-w-0">
                {hasImage ? (
                  <div className="w-12 h-12 flex-shrink-0 border-2 border-black bg-neutral-200 overflow-hidden relative self-start sm:self-auto">
                    <img 
                      src={prompt.thumbnail_url || prompt.image_url || ""} 
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 flex-shrink-0 border-2 border-black bg-neutral-100 flex items-center justify-center self-start sm:self-auto">
                    <span className="font-display font-black text-xs">TXT</span>
                  </div>
                )}
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[9px] font-black uppercase bg-black text-white px-1.5 py-0.5 inline-block">
                      {prompt.category}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-sm md:text-base uppercase truncate">
                    {prompt.title}
                  </h3>
                  <div className="text-[10px] font-mono text-neutral-600 truncate mt-0.5">
                    by @{prompt.profiles?.username}
                  </div>
                </div>
              </div>

              {/* Stats Block */}
              <div className="col-span-1 sm:col-span-2 flex flex-row sm:flex-col justify-end sm:justify-center items-center sm:border-l-2 sm:border-black sm:pl-4 gap-2 sm:gap-1.5 font-mono text-[10px] font-black h-full w-full">
                <span className="flex items-center gap-1.5 w-full sm:w-auto bg-neutral-100 border border-neutral-300 px-2 py-1 justify-center sm:justify-start">
                  <MessageSquare className="w-3.5 h-3.5"/> 
                  <span>{prompt.commentCount}</span>
                </span>
                <span className="flex items-center gap-1.5 w-full sm:w-auto bg-[#ffecf5] text-[#f751a1] border border-[#ffb3d7] px-2 py-1 justify-center sm:justify-start">
                  ▲ <span>{prompt.voteScore}</span>
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-1 sm:col-span-2 flex justify-end gap-2 w-full sm:w-auto">
                <button
                  onClick={(e) => handleCopy(e, prompt.prompt_text, prompt.id)}
                  className="w-10 h-10 flex items-center justify-center border-2 border-black bg-white hover:bg-[#c8f560] transition-colors flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  aria-label="Copy prompt"
                >
                  {copiedId === prompt.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
                <div className="w-10 h-10 flex items-center justify-center border-2 border-black bg-black text-white group-hover:bg-white group-hover:text-black transition-colors flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
