import Link from "next/link";
import { PromptWithStats } from "@/lib/queries/prompts";
import { MessageSquare, Heart, Pencil } from "lucide-react";

export function ProfileFeed({ prompts, emptyMessage, isOwner = false }: { prompts: PromptWithStats[], emptyMessage: string, isOwner?: boolean }) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <p className="font-mono text-xl font-bold uppercase">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 border-t-4 border-black">
      {prompts.map((prompt) => {
        const hasImage = !!(prompt.thumbnail_url || prompt.image_url);

        return (
          <div
            key={prompt.id}
            className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b-4 border-black hover:bg-[#c8f560]/10 transition-colors bg-white"
          >
            {/* Main Link Overlay */}
            <Link 
              href={`/prompts/${prompt.id}`}
              className="absolute inset-0 z-10"
              aria-label={`View prompt: ${prompt.title}`}
            />

            {/* Thumbnail */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border-2 border-black bg-neutral-100 overflow-hidden relative pointer-events-none">
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
            <div className="flex-grow min-w-0 flex flex-col justify-center pointer-events-none">
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
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold">
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

            {/* Edit Button Overlay for Owner */}
            {isOwner && (
              <div className="absolute top-4 right-4 z-20">
                <Link
                  href={`/prompts/${prompt.id}/edit`}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 border-black bg-[#ffd369] text-black hover:bg-black hover:text-[#ffd369] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] relative"
                  title="Edit Prompt"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
