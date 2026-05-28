import { StickyFeed } from "@/components/sticky-feed";
import { getPublicFeed } from "@/lib/queries/prompts";
import { Pagination } from "@/components/pagination";

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const limit = 20;

  const { prompts, totalPages } = await getPublicFeed({ page, limit });

  return (
    <>
      {/* Hero Header Section */}
      <div className="grid gap-6 lg:grid-cols-12 mb-16 mt-2" id="feed-hero-header">
        {/* Main Hero Card */}
        <div className="lg:col-span-8 bg-[#c8f560] border-4 border-black p-8 max-sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none relative overflow-hidden group">
          {/* Animated decorative patterns */}
          <div className="absolute -right-10 -top-10 w-40 h-40 border-4 border-black rounded-full opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
          <div className="absolute right-20 -bottom-10 w-24 h-24 border-4 border-black rotate-45 opacity-20 group-hover:rotate-90 transition-transform duration-700 pointer-events-none" />

          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black font-mono text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-6">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-none border border-black animate-pulse" />
              LIVE PROMPT NETWORK
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl uppercase leading-[0.95] tracking-[-0.02em] mb-4 text-black">
              DROP VIBES.
              <br />
              <span className="text-white custom-text-stroke relative inline-block">
                GET COPIED.
                {/* Scribble SVG underline */}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-black fill-current" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0, 50 5 T 100 5 L 100 10 L 0 10 Z" />
                </svg>
              </span>
            </h1>

            <p className="font-sans text-sm sm:text-base text-neutral-800 font-bold max-w-md leading-relaxed border-l-4 border-black pl-4">
              Copy fast, save what works, and watch the feed reward the best creations. Your aesthetic starts here.
            </p>
          </div>
        </div>

        {/* Right Info Sidebar / Stats Card */}
        <div className="lg:col-span-4 bg-[#fbfcfa] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-black">
              <span className="font-display font-black text-sm uppercase tracking-wider">
                Trend Multipliers
              </span>
            </div>

            <p className="font-sans text-xs text-neutral-600 mb-4">
              Trending score refreshes every hour. Keep remixing to stay on top.
            </p>

            <ul className="flex flex-col gap-3 font-mono text-[10px] font-bold uppercase" id="hero-stats-list">
              <li className="flex justify-between items-center bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span>Copy count</span>
                <span className="text-xl font-black">x5</span>
              </li>
              <li className="flex justify-between items-center bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span>Save weight</span>
                <span className="text-xl font-black">x4</span>
              </li>
              <li className="flex justify-between items-center bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span>Votes steer</span>
                <span className="text-xl font-black text-[#f751a1]">x3</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <StickyFeed prompts={prompts} />
      
      {prompts.length > 0 && (
        <div className="mt-16 mb-8 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} basePath="/" />
        </div>
      )}
    </>
  );
}
