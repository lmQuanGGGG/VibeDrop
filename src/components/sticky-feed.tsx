"use client";

import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import { useState } from "react";
import { VoteButton } from "@/components/vote-button";
import { CopyButton } from "@/components/copy-button";
import { PromptWithStats } from "@/lib/queries/prompts";

const STACK_COLORS = [
  "bg-[#c8f560]", // Neon Green
  "bg-[#ffd369]", // Yellow
  "bg-[#ffecf5]", // Light Pink
  "bg-white",     // White
  "bg-[#a78bfa]", // Purple
  "bg-[#67e8f9]", // Cyan
];

export function StickyFeed({ prompts }: { prompts: PromptWithStats[] }) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!prompts || prompts.length === 0) {
    return (
      <div className="py-20 text-center border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-display font-black text-2xl uppercase mb-2">
          No Prompts Found
        </h3>
        <p className="font-mono text-neutral-600">
          The feed is currently empty.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-32 pb-32 max-w-5xl mx-auto relative">
      {prompts.map((prompt, idx) => {
        const color = STACK_COLORS[idx % STACK_COLORS.length];
        const hasImage = !!(prompt.thumbnail_url || prompt.image_url);
        
        return (
          <div 
            key={prompt.id} 
            className="sticky top-24 transition-all duration-300 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black w-full"
            style={{ zIndex: idx }}
          >
            <div 
              className={`block w-full min-h-[400px] md:min-h-[450px] ${color} overflow-hidden group cursor-pointer`}
              onClick={() => window.location.href = `/prompts/${prompt.id}`}
            >
              <div className="flex flex-col md:flex-row h-full">
                
                {/* Image Area */}
                <div className="w-full md:w-2/5 border-b-4 md:border-b-0 md:border-r-4 border-black relative bg-black shrink-0 z-10 flex items-center justify-center min-h-[250px] md:min-h-full">
                  {hasImage ? (
                    <img 
                      src={prompt.thumbnail_url || prompt.image_url || ""} 
                      alt={prompt.title} 
                      className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-neutral-100">
                      <span className="font-display font-black text-4xl uppercase break-words line-clamp-4">
                        TXT
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between relative z-10 flex-grow">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="font-mono text-xs font-black uppercase bg-black text-white px-3 py-1.5 inline-block">
                        {prompt.category}
                      </span>
                      <span className="font-mono text-xs font-bold bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        🔥 {Math.round(prompt.trendingScore || 0)} PTS
                      </span>
                    </div>
                    
                    <h3 className="font-display font-black text-2xl md:text-3xl uppercase leading-[1.1] mb-2 break-words line-clamp-2">
                      {prompt.title}
                    </h3>
                    
                    <div className="text-sm font-mono text-black font-bold mb-4">
                      by @{prompt.profiles?.username}
                    </div>

                    <p className="font-sans text-sm font-bold text-neutral-900 line-clamp-5 leading-relaxed border-l-4 border-black pl-4 bg-white/30 py-2">
                      {prompt.prompt_text}
                    </p>
                  </div>

                  {/* Actions & Stats */}
                  <div className="flex flex-wrap items-center justify-between mt-8 pt-6 border-t-4 border-black gap-4 relative z-20">
                    <div className="flex flex-wrap items-center gap-2">
                      <div onClick={(e) => e.stopPropagation()} className="pointer-events-auto">
                        <VoteButton
                          promptId={prompt.id}
                          initialScore={prompt.voteScore || 0}
                          initialValue={prompt.viewerVote || 0}
                        />
                      </div>
                      
                      <Link 
                        href={`/prompts/${prompt.id}`}
                        className="flex items-center gap-2 py-2 px-3 bg-white border-2 border-black font-mono font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all pointer-events-auto"
                      >
                        <MessageSquare className="w-4 h-4"/> 
                        {prompt.commentCount || 0}
                      </Link>

                      <div className="hidden sm:block pointer-events-auto">
                        <CopyButton promptId={prompt.id} promptText={prompt.prompt_text} />
                      </div>
                      
                      <Link
                        href={`/create?remix=${prompt.id}`}
                        className="hidden sm:flex items-center gap-1.5 py-2 px-3 bg-black hover:bg-neutral-800 text-white border-2 border-black font-display font-black uppercase text-[10px] tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all pointer-events-auto"
                      >
                        <span className="material-symbols-outlined text-[14px]">auto_fix</span>
                        REMIX
                      </Link>

                      {prompt.isOwner && (
                        <Link
                          href={`/prompts/${prompt.id}/edit`}
                          className="flex items-center gap-1.5 py-2 px-3 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black font-display font-black uppercase text-[10px] tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all pointer-events-auto"
                        >
                          EDIT
                        </Link>
                      )}
                    </div>

                    <div className="flex gap-2 pointer-events-auto">
                      <div className="sm:hidden">
                        <CopyButton promptId={prompt.id} promptText={prompt.prompt_text} />
                      </div>
                      <Link 
                        href={`/prompts/${prompt.id}`}
                        className="w-10 h-10 flex items-center justify-center border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
