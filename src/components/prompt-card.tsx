
import Link from "next/link";
import { PromptWithStats } from "@/lib/queries/prompts";
import { CopyButton } from "@/components/copy-button";
import { SaveButton } from "@/components/save-button";
import { VoteButton } from "@/components/vote-button";
import { MessageSquare } from "lucide-react";

export type PromptCardProps = {
  prompt: PromptWithStats;
};

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export function PromptCard({ prompt }: PromptCardProps) {
  const displayName = prompt.profiles?.display_name || prompt.profiles?.username || "Anonymous";
  
  return (
    <article
      className="bg-white border-4 border-black font-sans relative flex flex-col md:flex-row shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 rounded-none overflow-hidden"
    >
      {/* Absolute bookmark save button */}
      <SaveButton promptId={prompt.id} initialSaved={prompt.viewerSaved} />

      {/* Hero Visual Banner Container */}
      <div className="relative h-48 md:h-auto md:w-2/5 md:min-h-[250px] md:border-b-0 md:border-r-2 flex-shrink-0 overflow-hidden border-b-2 border-black animated-bg flex items-center justify-center bg-neutral-100">
        {(prompt.thumbnail_url || prompt.image_url) ? (
          <>
            {/* Blurred background layer */}
            <img src={prompt.thumbnail_url || prompt.image_url || undefined} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110" />
            {/* Main uncropped image */}
            <img src={prompt.thumbnail_url || prompt.image_url || undefined} alt={prompt.title} className="absolute inset-0 w-full h-full object-contain z-0 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] p-2" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-black/5" />
            <span className="font-display font-black text-2xl tracking-widest uppercase text-black/20 z-10 select-none">
              {prompt.category}
            </span>
          </>
        )}
        
        {/* Categories / Tag Badges (Overlay top left) */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
          {prompt.tags?.slice(0, 3).map((tag) => (
            <Link
              href={`/tags/${tag}`}
              key={tag}
              className="font-mono text-[9px] font-black tracking-wider uppercase bg-white text-black py-1 px-2 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 transition-colors"
            >
              #{tag}
            </Link>
          ))}
          <span className="font-mono text-[9px] font-black text-white py-1 px-2 bg-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] uppercase">
            {prompt.category}
          </span>
        </div>
      </div>

      {/* Content wrapper for responsive layout */}
      <div className="flex flex-col flex-grow min-w-0 md:w-3/5">
        {/* Title block over detailed container */}
        <Link href={`/prompts/${prompt.id}`} className="bg-black text-white py-3 px-5 border-b-2 border-black hover:bg-neutral-800 transition-colors block pr-14">
          <h3 className="font-display font-black text-sm tracking-wide uppercase leading-tight line-clamp-1">
            {prompt.title}
          </h3>
        </Link>

        {/* Body prompt detailed container */}
        <div className="p-5 flex flex-col gap-4 flex-grow bg-white">
          {/* Creator Info Grid Header */}
          <Link href={`/profile/${prompt.profiles?.username}`} className="flex items-center gap-3 group">
            <img
              src={prompt.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
              alt={displayName}
              className="w-8 h-8 rounded-none border-2 border-black flex-shrink-0 bg-neutral-100 object-cover group-hover:scale-105 transition-transform"
            />
            <div className="min-w-0">
              <span className="font-display font-black text-xs text-black uppercase tracking-tight block leading-none group-hover:underline">
                {displayName}
              </span>
              <span className="font-mono text-[9px] text-neutral-500 font-bold tracking-tight block mt-1 leading-none">
                @{prompt.profiles?.username || "anon"}
              </span>
            </div>
          </Link>

          {/* Editor Bold Quote Box */}
          <blockquote className="my-1 py-3 px-4 bg-yellow-50/70 border-l-4 border-2 border-black font-mono text-[11px] font-bold text-black leading-relaxed relative rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] max-h-28 overflow-y-auto custom-scrollbar">
            <span>{prompt.prompt_text}</span>
          </blockquote>

          {/* Result Text (if exists) */}
          {prompt.result_text && (
            <div className="bg-neutral-100 border-2 border-black p-3 rounded-none">
              <p className="font-sans text-[10px] text-neutral-700 italic line-clamp-3">
                {prompt.result_text}
              </p>
            </div>
          )}

          {/* Engagement counters bar */}
          <div className="flex items-center justify-between flex-wrap gap-y-3 mt-auto pt-4 border-t-2 border-black">
            <div className="flex items-center gap-4 text-black font-mono text-[10px] font-bold uppercase flex-shrink-0">
              <VoteButton
                promptId={prompt.id}
                initialScore={prompt.voteScore}
                initialValue={prompt.viewerVote}
              />

              <Link href={`/prompts/${prompt.id}`} className="flex items-center gap-1.5 hover:text-[#f751a1] transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{formatNumber(prompt.commentCount)}</span>
              </Link>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {prompt.isOwner && (
                <div className="flex items-center gap-1.5 mr-2 pr-2 border-r-2 border-black">
                  <Link 
                    href={`/prompts/${prompt.id}/edit`}
                    className="flex-shrink-0 font-mono text-[9px] font-black uppercase text-white bg-black hover:bg-neutral-800 px-2 py-1.5 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-px transition-all"
                  >
                    Edit
                  </Link>
                </div>
              )}
              <div className="flex-shrink-0">
                <CopyButton promptId={prompt.id} promptText={prompt.prompt_text} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
