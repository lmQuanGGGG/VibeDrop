import { AppShell } from "@/components/app-shell";
import { PromptFeed } from "@/components/prompt-feed";
import { getTrendingPrompts } from "@/lib/queries/prompts";

export default async function TrendingPage() {
  const prompts = await getTrendingPrompts();

  return (
    <AppShell
      title="Trending"
      description="Prompts climbing the feed right now"
    >
      <PromptFeed
        prompts={prompts}
        emptyMessage="Nothing trending yet. Be the spark."
      />
    </AppShell>
  );
}
