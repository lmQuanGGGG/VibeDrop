import { AppShell } from "@/components/app-shell";
import { TrendingFeed } from "@/components/trending-feed";
import { getTrendingPrompts } from "@/lib/queries/prompts";

export default async function TrendingPage() {
  // Always fetch just the top 30 for the billboard chart
  const { prompts } = await getTrendingPrompts(1, 30);

  return (
    <AppShell
      title="Trending"
      description="The definitive top 30 billboard chart"
    >
      <TrendingFeed prompts={prompts} />
    </AppShell>
  );
}
