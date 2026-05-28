import { PromptArchiveList } from "@/components/prompt-archive-list";
import { getSavedPrompts } from "@/lib/queries/prompts";

export default async function SavedPage() {
  const prompts = await getSavedPrompts();

  return (
    <>
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-display font-black uppercase tracking-wide">Saved prompts</h1>
        <p className="text-sm font-sans text-neutral-600">Your private stack of go-to prompts</p>
      </div>
      <div className="pb-10">
        <PromptArchiveList
          prompts={prompts}
          emptyMessage="No prompts saved yet. Start exploring!"
        />
      </div>
    </>
  );
}
