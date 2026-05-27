import Link from "next/link";
import {
  Bookmark,
  Compass,
  Home,
  PlusCircle,
  TrendingUp,
  User,
  Search
} from "lucide-react";
import { getCachedAuthUser } from "@/lib/supabase/server";

export async function CreatorSidebar() {
  const { user, profile } = await getCachedAuthUser();

  let profileHref = "/login";
  let profileLabel = "Profile (Log in)";

  if (user && profile) {
    profileHref = `/profile/${profile.username}`;
    profileLabel = "My Profile";
  }

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/trending", label: "Trending", icon: TrendingUp },
    { href: "/explore", label: "Explore", icon: Search },
    { href: "/create", label: "Create Prompt", icon: PlusCircle },
    { href: "/saved", label: "Saved", icon: Bookmark },
    { href: profileHref, label: profileLabel, icon: User },
  ];

  return (
    <aside
      className="w-64 max-lg:hidden fixed left-0 top-0 bottom-0 p-6 flex flex-col justify-between border-r-2 border-black bg-white z-30 font-sans"
      id="desktop-sidebar"
    >
      {/* Top Brand Logo Container */}
      <div className="flex flex-col gap-8" id="sidebar-top">
        <Link
          href="/"
          className="cursor-pointer group flex flex-col gap-0.5 border-b-2 border-black pb-4"
          id="sidebar-logo-container"
        >
          <span className="font-display font-black tracking-[-0.03em] text-neutral-900 text-3xl uppercase italic leading-none">
            VIBEDROP
          </span>
          <span className="text-[9px] font-mono font-black text-black tracking-[0.25em] uppercase block">
            Prompt Network
          </span>
        </Link>

        {/* Navigation Items List */}
        <nav className="flex flex-col gap-2" id="sidebar-nav">
          {navItems.map((item) => {
            // Very basic active state logic. In a real app we'd use usePathname()
            const active = false; 

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 py-3 px-4 border-2 transition-all duration-150 w-full text-left cursor-pointer uppercase font-display font-black text-xs tracking-wider group ${
                  active
                    ? 'bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]'
                    : 'bg-white text-neutral-700 border-transparent hover:border-black hover:text-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-xl transition-transform duration-150 group-hover:scale-105 ${
                    active ? 'text-white' : 'text-black'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Upgrade Box Pro Premium Banner */}
      <div className="flex flex-col gap-4" id="sidebar-bottom font-mono">
        <div className="bg-white border-2 border-black p-5 rounded-none relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" id="upgrade-plus-banner">
          <div className="flex items-center gap-2 mb-2" id="upgrade-plus-badge">
            <span className="material-symbols-outlined text-sm text-black">
              star
            </span>
            <span className="font-mono text-[9px] font-black text-black tracking-[0.15em] uppercase">
              VANGUARD MEMBERSHIP
            </span>
          </div>

          <h3 className="font-display font-black text-[11px] text-black uppercase leading-tight mb-1.5">
            Unlock unlimited premium prompt assets
          </h3>
          <p className="font-sans text-[10px] text-neutral-600 leading-normal mb-4">
            Unlock cinematic layouts, full model custom parameters & search integrations.
          </p>

          <Link
            href="/create"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-black text-white border-2 border-black font-display font-black uppercase text-xs rounded-none hover:bg-neutral-800 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all cursor-pointer"
            id="sidebar-upgrade-btn"
          >
            UPGRADE NOW
          </Link>
        </div>

        {/* Legal copyright notes info */}
        <div className="text-[9px] text-neutral-400 font-mono text-center tracking-widest font-bold uppercase" id="sidebar-copyright">
          © {new Date().getFullYear()} VIBEDROP COLLECTIVE
        </div>
      </div>
    </aside>
  );
}
