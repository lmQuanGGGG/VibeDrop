import Link from "next/link";
import { PromptWithStats } from "@/lib/queries/prompts";
import { MessageSquare } from "lucide-react";
import { Marquee } from "@/components/marquee";

export type PromptRowProps = {
  title: string;
  prompts: PromptWithStats[];
  viewAllLink?: string;
  emptyMessage?: string;
  autoScroll?: boolean;
};

const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

export function PromptRow({ title, prompts, viewAllLink, emptyMessage = "No prompts yet.", autoScroll = false }: PromptRowProps) {
  if (prompts.length === 0) {
    return null;
  }

  const renderCards = (isDuplicate = false) => prompts.map((prompt, index) => {
    const displayName = prompt.profiles?.display_name || prompt.profiles?.username || "Anon";
    // Adding suffix to key when duplicating for marquee to ensure uniqueness
    const key = isDuplicate ? `${prompt.id}-dup-${index}` : prompt.id;
    return (
      <div
        key={key}
        className="flex-shrink-0 w-[280px] sm:w-[320px] bg-white border-4 border-black flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all snap-start"
      >
        {/* Image Header */}
        <Link href={`/prompts/${prompt.id}`} className="block relative h-40 bg-neutral-100 border-b-2 border-black overflow-hidden flex-shrink-0 group">
          {(prompt.thumbnail_url || prompt.image_url) ? (
            <>
              <img src={prompt.thumbnail_url || prompt.image_url || undefined} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110" />
              <img src={prompt.thumbnail_url || prompt.image_url || undefined} alt={prompt.title} className="absolute inset-0 w-full h-full object-contain z-0 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform duration-500" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 animated-bg">
              <span className="font-display font-black text-xl tracking-widest uppercase text-black/20 select-none">
                {prompt.category}
              </span>
            </div>
          )}
        </Link>

        {/* Body */}
        <div className="p-4 flex flex-col flex-grow gap-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] font-black text-white py-0.5 px-1.5 bg-black uppercase">
              {prompt.category}
            </span>
          </div>
          
          <Link href={`/prompts/${prompt.id}`} className="block group">
            <h3 className="font-display font-black text-sm uppercase tracking-wide line-clamp-1 group-hover:underline">
              {prompt.title}
            </h3>
          </Link>

          <p className="font-sans text-[10px] text-neutral-600 line-clamp-2 leading-relaxed flex-grow">
            {prompt.prompt_text}
          </p>

          {/* Footer Bar */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-black">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={prompt.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
                alt={displayName}
                className="w-5 h-5 rounded-none border border-black bg-neutral-100 object-cover flex-shrink-0"
              />
              <span className="font-mono text-[9px] font-bold uppercase truncate text-neutral-800">
                @{prompt.profiles?.username}
              </span>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 text-black font-mono text-[9px] font-bold">
                <MessageSquare className="w-3 h-3" />
                <span>{formatNumber(prompt.commentCount)}</span>
              </div>
              <div className="flex items-center gap-1 text-black font-mono text-[9px] font-bold text-[#f751a1]">
                ▲ {formatNumber(prompt.voteScore)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between border-b-2 border-black pb-2">
        <h2 className="font-display font-black text-2xl uppercase tracking-wider text-black">
          {title}
        </h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="flex items-center gap-1 font-mono text-xs font-black uppercase hover:bg-[#c8f560] px-3 py-1 border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            View All →
          </Link>
        )}
      </div>

      {autoScroll ? (
        <Marquee speed="slow" gap="gap-4" className="-mx-2 px-2 pb-4">
          {renderCards(false)}
        </Marquee>
      ) : (
        <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar snap-x snap-mandatory pr-8">
          {renderCards(false)}
        </div>
      )}
    </section>
  );
}
