import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getTrendingPrompts, getPopularTags, getPromptsByCategory, getPublicFeed } from "@/lib/queries/prompts";
import { Compass, Palette, Camera, Code2, PenTool, Sparkles, Search } from "lucide-react";
import { PromptRow } from "@/components/prompt-row";
import { PromptFeed } from "@/components/prompt-feed";
import { Marquee } from "@/components/marquee";

const CATEGORIES = [
  { name: "ChatGPT", icon: Sparkles, color: "bg-[#c8f560]" },
  { name: "Midjourney", icon: Palette, color: "bg-[#f751a1]" },
  { name: "Photography", icon: Camera, color: "bg-[#b5ffa2]" },
  { name: "Coding", icon: Code2, color: "bg-[#ffd369]" },
  { name: "Writing", icon: PenTool, color: "bg-[#7ce0ff]" },
  { name: "UI/UX", icon: Compass, color: "bg-[#ff9e9e]" },
];

type ExplorePageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { q } = (await searchParams) ?? {};
  const query = q?.trim();

  // If there is a search query, only fetch search results
  if (query) {
    const { prompts: searchResults } = await getPublicFeed({ query });
    return (
      <AppShell title="Search" description={`Results for "${query}"`}>
        <div className="mb-8 mt-2 border-b-4 border-black pb-4">
          <h1 className="font-display font-black text-3xl uppercase tracking-wide flex items-center gap-3">
            <Search className="w-8 h-8" strokeWidth={3} />
            Search Results
          </h1>
          <p className="font-mono text-sm font-bold mt-2">
            Showing prompts matching <span className="bg-[#b5ffa2] border border-black px-1">"{query}"</span>
          </p>
        </div>
        <PromptFeed
          prompts={searchResults}
          emptyMessage={`No prompts found for "${query}". Try another search term.`}
        />
      </AppShell>
    );
  }

  // Otherwise, fetch multiple curated feeds in parallel for Discovery
  const [
    popularTags, 
    { prompts: freshPrompts }, 
    codingPrompts, 
    midjourneyPrompts,
    photoPrompts
  ] = await Promise.all([
    getPopularTags(15),
    getPublicFeed(),
    getPromptsByCategory("coding", 8),
    getPromptsByCategory("midjourney", 8),
    getPromptsByCategory("photography", 8)
  ]);

  return (
    <AppShell
      title="Explore"
      description="Discover new categories, trending vibes, and top creators."
    >
      <div className="flex flex-col gap-12 pb-10 overflow-hidden">
        
        {/* Categories Grid (Auto Scroll Marquee) */}
        <section>
          <h2 className="font-display font-black text-xl uppercase tracking-wider mb-4 border-b-2 border-black pb-2">
            Browse by Vibe
          </h2>
          <Marquee speed="normal" gap="gap-3" className="-mx-4 px-4 pb-4">
            {CATEGORIES.map((cat, index) => (
              <Link
                key={`${cat.name}-${index}`}
                href={`/explore?q=${encodeURIComponent(cat.name)}`}
                className={`${cat.color} w-40 flex-shrink-0 border-4 border-black p-4 flex flex-col items-center justify-center gap-2 h-28 rounded-none hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 group relative overflow-hidden`}
              >
                <div className="absolute -right-4 -top-4 w-12 h-12 border-2 border-black rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
                <cat.icon className="w-6 h-6 text-black stroke-[2.5px]" />
                <span className="font-display font-black uppercase tracking-wider text-black text-[11px]">
                  {cat.name}
                </span>
              </Link>
            ))}
          </Marquee>
        </section>

        {/* Netflix-style Horizontal Rows */}
        <PromptRow 
          title="✨ Fresh Drops" 
          prompts={freshPrompts.slice(0, 8)} 
          viewAllLink="/" 
          autoScroll={true}
        />

        <PromptRow 
          title="💻 Top in Coding" 
          prompts={codingPrompts} 
          viewAllLink="/explore?q=coding" 
        />

        <PromptRow 
          title="🎨 Best of Midjourney" 
          prompts={midjourneyPrompts} 
          viewAllLink="/explore?q=midjourney" 
        />
        
        <PromptRow 
          title="📸 Photography Aesthetics" 
          prompts={photoPrompts} 
          viewAllLink="/explore?q=photography" 
        />

        {/* Popular Tags Footer Cluster */}
        <section className="bg-neutral-100 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-8">
          <h2 className="font-display font-black text-xl uppercase tracking-wider mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
            Trending Hashtags
          </h2>
          {popularTags.length > 0 ? (
            <Marquee speed="normal" gap="gap-3" className="py-2">
              {popularTags.map((tag, index) => (
                <Link
                  key={`${tag}-${index}`}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="font-mono text-xs font-black uppercase text-black bg-white border-2 border-black py-2 px-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#c8f560] transition-colors active:translate-y-px active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap"
                >
                  #{tag}
                </Link>
              ))}
            </Marquee>
          ) : (
            <p className="font-mono text-sm text-neutral-500 italic">No tags trending yet.</p>
          )}
        </section>

      </div>
    </AppShell>
  );
}
