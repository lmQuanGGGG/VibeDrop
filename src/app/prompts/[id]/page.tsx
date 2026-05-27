import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CommentSection } from "@/components/comment-section";
import { CopyButton } from "@/components/copy-button";
import { PromptViewTracker } from "@/components/prompt-view-tracker";
import { ReportButton } from "@/components/report-button";
import { SaveButton } from "@/components/save-button";
import { VoteButton } from "@/components/vote-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPromptComments } from "@/lib/queries/comments";
import { getPromptById } from "@/lib/queries/prompts";

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = await getPromptById(id);

  if (!prompt) {
    notFound();
  }

  const comments = await getPromptComments(prompt.id);

  return (
    <AppShell
      title={prompt.title}
      description={`Category: ${prompt.category}`}
    >
      <PromptViewTracker promptId={prompt.id} />
      
      <div className="bg-[#b5ffa2] border-4 border-black p-8 max-sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none mb-8 relative">
        <div className="absolute top-4 right-4 text-xs font-mono font-bold bg-white px-2 py-1 border-2 border-black">
          {prompt.copy_count} COPIES
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6 mt-2">
          {prompt.tags?.map((tag) => (
            <span key={tag} className="font-mono text-[10px] font-black uppercase text-black bg-white px-2 py-1 border-2 border-black">
              #{tag}
            </span>
          ))}
        </div>

        {prompt.image_url && (
          <div className="mb-6 relative w-full h-64 sm:h-80 md:h-96 border-4 border-black overflow-hidden bg-neutral-100 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <img src={prompt.image_url} alt="" className="absolute inset-0 w-full h-full object-cover blur-xl opacity-50 scale-110" />
            <img src={prompt.image_url} alt={prompt.title} className="relative z-10 w-full h-full object-contain p-4 drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]" />
          </div>
        )}

        <div className="bg-white border-4 border-black p-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
          <h2 className="font-display font-black text-xl uppercase tracking-wide mb-4">Prompt</h2>
          <div className="max-h-80 overflow-y-auto pr-4 custom-scrollbar">
            <p className="font-sans text-sm sm:text-base text-neutral-800 leading-relaxed whitespace-pre-line">
              {prompt.prompt_text}
            </p>
          </div>
        </div>

        {prompt.result_text ? (
          <div className="bg-[#fbfcfa] border-4 border-black p-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
            <h2 className="font-display font-black text-xl uppercase tracking-wide mb-4 text-[#f751a1]">AI Result</h2>
            <div className="font-mono text-xs sm:text-sm text-neutral-700">
              {prompt.result_text}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <VoteButton
            promptId={prompt.id}
            initialScore={prompt.voteScore}
            initialValue={prompt.viewerVote}
          />
          <CopyButton promptId={prompt.id} promptText={prompt.prompt_text} />
          
          <Link
            href={`/create?remix=${prompt.id}`}
            className="flex items-center gap-2 py-2.5 px-4 bg-black hover:bg-neutral-800 text-white border-2 border-black font-display font-black uppercase text-[10px] tracking-wider rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
          >
            <span className="material-symbols-outlined text-sm">auto_fix</span>
            REMIX PROMPT
          </Link>

          <ReportButton promptId={prompt.id} />
          
          {prompt.isOwner && (
            <>
              <Link
                href={`/prompts/${prompt.id}/edit`}
                className="flex items-center gap-2 py-2.5 px-4 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black font-display font-black uppercase text-[10px] tracking-wider rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all ml-auto"
              >
                EDIT
              </Link>
              {/* Delete form needs to be handled properly, but since we are in a server component we can import deletePrompt */}
            </>
          )}
        </div>
        
        {/* We keep the save button absolute like in the prompt card, or inline */}
        <div className="absolute bottom-4 right-4">
           <SaveButton promptId={prompt.id} initialSaved={prompt.viewerSaved} />
        </div>
      </div>

      <CommentSection promptId={prompt.id} comments={comments} />
    </AppShell>
  );
}
