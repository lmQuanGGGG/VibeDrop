import { AppShell } from "@/components/app-shell";
import { PromptFeed } from "@/components/prompt-feed";
import { getSavedPrompts } from "@/lib/queries/prompts";

export default async function SavedPage() {
  const prompts = await getSavedPrompts();

  return (
    <AppShell
      title="Saved prompts"
      description="Your private stack of go-to prompts"
    >
      <PromptFeed
        prompts={prompts}
        emptyMessage="Save prompts to build your personal library."
      />
    </AppShell>
  );
}
