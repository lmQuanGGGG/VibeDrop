"use client";

import Link from "next/link";
import { PromptWithStats } from "@/lib/queries/prompts";
import { MessageSquare, Copy, ArrowRight, Check, Trophy } from "lucide-react";
import { useState } from "react";

export function TrendingFeed({ prompts }: { prompts: PromptWithStats[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (e: React.MouseEvent, text: string, id: string) => {
    e.preventDefault(); // Prevent navigating to the prompt page
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      
      // Fire and forget copy increment
      fetch(`/api/prompts/${id}/copy`, { method: "POST" }).catch(() => {});

      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <p className="font-mono text-xl font-bold uppercase">Nothing trending yet.</p>
      </div>
    );
  }

  const top1 = prompts[0];
  const top2_3 = prompts.slice(1, 3);
  const rest = prompts.slice(3);

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* 👑 TOP 1 - THE CROWN */}
      {top1 && (
        <section>
          <div className="inline-flex items-center gap-2 font-display font-black text-3xl uppercase tracking-wider mb-4">
            <Trophy className="w-8 h-8 text-[#ffd369]" fill="#ffd369" strokeWidth={2} />
            <span>#1 Global Trend</span>
          </div>
          
          <Link
            href={`/prompts/${top1.id}`}
            className="group block relative bg-[#ffd369] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-200"
          >
            <div className="flex flex-col md:flex-row min-h-[24rem]">
              {/* Image Area */}
              <div className="w-full md:w-2/5 border-b-4 md:border-b-0 md:border-r-4 border-black relative bg-black shrink-0 z-10 flex items-center justify-center p-4">
                {(top1.thumbnail_url || top1.image_url) ? (
                  <img 
                    src={top1.thumbnail_url || top1.image_url || ""} 
                    alt={top1.title} 
                    className="w-full h-full max-h-80 md:max-h-none object-contain drop-shadow-[8px_8px_0px_rgba(200,245,96,0.5)] group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 p-8 text-center">
                    <span className="font-display font-black text-4xl uppercase break-words line-clamp-4">
                      {top1.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between relative z-10 bg-[#ffd369] overflow-hidden">
                {/* Giant Rank Number Watermark inside content area */}
                <div className="absolute right-0 top-0 font-display font-black text-[12rem] md:text-[24rem] text-black opacity-10 pointer-events-none leading-none z-0 translate-x-10 -translate-y-10">
                  1
                </div>

                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="font-mono text-xs font-black uppercase bg-black text-white px-2 py-1 inline-block">
                      {top1.category}
                    </span>
                    <span className="font-mono text-xs font-bold bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      🔥 {Math.round(top1.trendingScore)} PTS
                    </span>
                  </div>
                  
                  <h3 className="font-display font-black text-3xl md:text-5xl uppercase leading-[0.95] mb-4 break-words line-clamp-3">
                    {top1.title}
                  </h3>
                  
                  <div className="text-sm font-mono text-black font-bold mb-6">
                    by @{top1.profiles?.username}
                  </div>

                  <p className="font-sans text-sm md:text-base font-bold text-neutral-900 line-clamp-4 leading-relaxed border-l-4 border-black pl-4">
                    {top1.prompt_text}
                  </p>
                </div>

                {/* Actions & Stats */}
                <div className="flex flex-wrap items-center justify-between mt-8 pt-6 border-t-4 border-black gap-4 relative z-10">
                  <div className="flex items-center gap-4 font-mono text-sm font-black">
                    <span className="flex items-center gap-2 bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <MessageSquare className="w-4 h-4"/> {top1.commentCount}
                    </span>
                    <span className="flex items-center gap-2 bg-white text-[#f751a1] border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      ▲ {top1.voteScore}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={(e) => handleCopy(e, top1.prompt_text, top1.id)}
                      className="w-12 h-12 flex items-center justify-center border-4 border-black bg-white hover:bg-black hover:text-white transition-colors flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {copiedId === top1.id ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                    </button>
                    <div className="w-12 h-12 flex items-center justify-center border-4 border-black bg-black text-[#ffd369] group-hover:bg-white group-hover:text-black transition-colors flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* 🥈🥉 TOP 2 & 3 - THE RUNNER-UPS */}
      {top2_3.length > 0 && (
        <section className="flex flex-col gap-6">
          {top2_3.map((prompt, idx) => (
            <Link
              key={prompt.id}
              href={`/prompts/${prompt.id}`}
              className="group block relative bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 min-h-[16rem]">
                {/* Image Area */}
                <div className="border-b-4 md:border-b-0 md:border-r-4 border-black relative bg-black z-10 flex items-center justify-center overflow-hidden aspect-video md:aspect-auto">
                  {(prompt.thumbnail_url || prompt.image_url) ? (
                    <img 
                      src={prompt.thumbnail_url || prompt.image_url || ""} 
                      alt={prompt.title} 
                      className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 opacity-90 p-2" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#c8f560] p-6 text-center">
                      <span className="font-display font-black text-xl uppercase break-words line-clamp-3">
                        {prompt.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="md:col-span-2 p-5 md:p-6 flex flex-col justify-between relative z-10 bg-transparent min-w-0 overflow-hidden">
                  {/* Giant Rank Number Watermark inside content area */}
                  <div className="absolute right-0 top-0 font-display font-black text-[8rem] md:text-[16rem] text-black opacity-[0.03] pointer-events-none leading-none z-0 translate-x-4 -translate-y-8">
                    {idx + 2}
                  </div>

                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="font-mono text-[10px] font-black uppercase bg-black text-white px-2 py-1">
                        {prompt.category}
                      </span>
                      <span className="font-mono text-[10px] font-bold bg-neutral-100 border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        🔥 {Math.round(prompt.trendingScore)} PTS
                      </span>
                    </div>
                    
                    <h3 className="font-display font-black text-2xl md:text-3xl uppercase leading-tight mb-2 break-words line-clamp-2 pr-12">
                      {prompt.title}
                    </h3>
                    
                    <div className="text-xs font-mono text-neutral-600 font-bold mb-4">
                      by @{prompt.profiles?.username}
                    </div>

                    <p className="font-sans text-sm md:text-base font-bold text-neutral-800 line-clamp-2 md:line-clamp-3 border-l-4 border-black pl-3">
                      {prompt.prompt_text}
                    </p>
                  </div>

                  {/* Actions & Stats */}
                  <div className="flex flex-wrap items-center justify-between mt-6 gap-3 relative z-10">
                    <div className="flex items-center gap-3 font-mono text-sm font-black">
                      <span className="flex items-center gap-2 bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <MessageSquare className="w-4 h-4"/> {prompt.commentCount}
                      </span>
                      <span className="flex items-center gap-2 bg-white text-[#f751a1] border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        ▲ {prompt.voteScore}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleCopy(e, prompt.prompt_text, prompt.id)}
                        className="w-10 h-10 flex items-center justify-center border-2 border-black bg-white hover:bg-[#c8f560] transition-colors flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                      >
                        {copiedId === prompt.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                      <div className="w-10 h-10 flex items-center justify-center border-2 border-black bg-black text-white group-hover:bg-[#c8f560] group-hover:text-black transition-colors flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* 📊 THE CHART (Top 4 - 30) */}
      {rest.length > 0 && (
        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-black text-white px-6 py-4 border-b-4 border-black">
            <h2 className="font-display font-black text-xl uppercase tracking-widest">
              The Chart (Top 4-30)
            </h2>
          </div>

          <div className="flex flex-col">
            {rest.map((prompt, index) => {
              const rank = index + 4;
              const hasImage = !!(prompt.thumbnail_url || prompt.image_url);

              return (
                <Link
                  key={prompt.id}
                  href={`/prompts/${prompt.id}`}
                  className="group flex items-center gap-4 p-4 border-b-4 border-black last:border-b-0 hover:bg-[#f2f2f2] transition-colors"
                >
                  {/* Big Rank Number */}
                  <div className="w-12 sm:w-16 flex-shrink-0 flex items-center justify-center">
                    <span className="font-display font-black text-4xl sm:text-5xl text-neutral-300 group-hover:text-black transition-colors">
                      {String(rank).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border-2 border-black bg-neutral-100 overflow-hidden relative">
                    {hasImage ? (
                      <img 
                        src={prompt.thumbnail_url || prompt.image_url || ""} 
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-display font-black text-xs sm:text-sm">
                        TXT
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[9px] sm:text-[10px] font-black uppercase bg-black text-white px-1.5 py-0.5 inline-block">
                        {prompt.category}
                      </span>
                      <span className="font-mono text-[9px] font-bold text-neutral-500 hidden sm:inline-block">
                        🔥 {Math.round(prompt.trendingScore)}
                      </span>
                    </div>
                    
                    <h3 className="font-display font-black text-sm sm:text-base uppercase truncate">
                      {prompt.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-neutral-600 truncate">
                        by @{prompt.profiles?.username}
                      </span>
                      <span className="text-neutral-300 hidden sm:inline-block">•</span>
                      <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] font-bold">
                        <span className="flex items-center gap-1 text-neutral-600">
                          <MessageSquare className="w-3 h-3"/> 
                          {prompt.commentCount}
                        </span>
                        <span className="flex items-center gap-1 text-[#f751a1]">
                          ▲ {prompt.voteScore}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats (Mobile Only) */}
                  <div className="sm:hidden flex flex-col gap-1 font-mono text-[10px] font-bold shrink-0 items-end justify-center mr-2">
                    <span className="flex items-center gap-1 text-neutral-600">
                      <MessageSquare className="w-3 h-3"/> {prompt.commentCount}
                    </span>
                    <span className="flex items-center gap-1 text-[#f751a1]">
                      ▲ {prompt.voteScore}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleCopy(e, prompt.prompt_text, prompt.id)}
                      className="w-10 h-10 flex items-center justify-center border-2 border-black bg-white hover:bg-[#c8f560] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {copiedId === prompt.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <div className="w-10 h-10 flex items-center justify-center border-2 border-black bg-black text-white group-hover:bg-[#c8f560] group-hover:text-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
