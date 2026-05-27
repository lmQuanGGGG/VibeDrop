import { AppShell } from "@/components/app-shell";
import { PromptArchiveList } from "@/components/prompt-archive-list";
import { getSavedPrompts } from "@/lib/queries/prompts";

export default async function SavedPage() {
  const prompts = await getSavedPrompts();

  return (
    <AppShell
      title="Saved prompts"
      description="Your private stack of go-to prompts"
    >
      <div className="pb-10">
        <PromptArchiveList
          prompts={prompts}
          emptyMessage="No prompts saved yet. Start exploring!"
        />
      </div>
    </AppShell>
  );
}
