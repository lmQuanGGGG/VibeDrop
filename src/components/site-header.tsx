import Link from "next/link";
import { getCachedAuthUser } from "@/lib/supabase/server";
import { Search } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

export async function SiteHeader() {
  const { user, profile } = await getCachedAuthUser();

  const displayName = profile?.display_name || profile?.username || "You";

  return (
    <header
      className="h-20 border-b-2 border-black bg-white sticky top-0 px-6 max-sm:px-4 flex items-center justify-between z-40 font-sans"
      id="top-header"
    >
      {/* Search Input Container */}
      <div className="flex items-center gap-3 flex-grow max-w-lg" id="header-search-group">
        <form action="/explore" method="get" className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
          <input
            name="q"
            type="text"
            placeholder="Search prompt vibes, tags, or creators..."
            className="w-full bg-white border-2 border-black text-xs font-bold py-2.5 pl-11 pr-4 rounded-none text-black focus:outline-none focus:bg-neutral-50 placeholder-neutral-500 transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
        </form>
      </div>

      {/* Right side interactions */}
      <div className="flex items-center gap-4 ml-4" id="header-actions">
        {!user ? (
          <Link
            href="/login"
            className="py-2.5 px-4 bg-white hover:bg-neutral-100 text-black border-2 border-black font-display font-black uppercase text-[10px] tracking-wider rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Sign In
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${profile?.username}`}
              className="flex items-center gap-2 bg-white hover:bg-neutral-50 border-2 border-black py-1.5 pl-2 pr-3 max-sm:pr-2 rounded-none cursor-pointer transition-all active:translate-y-0.5 text-left shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <img
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-none border border-black flex-shrink-0 bg-neutral-100 object-cover"
              />
              <span className="font-display font-black text-[10px] tracking-wider uppercase text-black max-sm:hidden select-none">
                {displayName}
              </span>
            </Link>
            <LogoutButton />
          </div>
        )}
      </div>
    </header>
  );
}
