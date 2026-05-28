import { TrendingFeed } from "@/components/trending-feed";
import { getTrendingPrompts } from "@/lib/queries/prompts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending Billboard",
  description: "Check out the top 30 live ranked AI prompts on VibeDrop. Remix the best prompts, vote for your favorites, and climb the leaderboard.",
  alternates: {
    canonical: "/trending",
  },
};


export default async function TrendingPage() {
  // Always fetch just the top 30 for the billboard chart
  const { prompts } = await getTrendingPrompts(1, 30);

  return (
    <>
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-display font-black uppercase tracking-wide">Trending</h1>
        <p className="text-sm font-sans text-neutral-600">The definitive top 30 billboard chart</p>
      </div>
      <TrendingFeed prompts={prompts} />
    </>
  );
}
