import Link from "next/link";
import {
  Bookmark,
  Compass,
  Home,
  PlusCircle,
  TrendingUp,
  User,
} from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function MobileNav() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profileHref = "/login";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (profile) {
      profileHref = `/profile/${profile.username}`;
    }
  }

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/trending", label: "Trend", icon: TrendingUp },
    { href: "/create", label: "Drop", icon: PlusCircle, isMain: true },
    { href: "/saved", label: "Saved", icon: Bookmark },
    { href: profileHref, label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden border-t-2 border-black bg-white z-50 px-2 pb-safe pt-2 shadow-[0_-4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto relative">
        {navItems.map((item) => {
          if (item.isMain) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="absolute left-1/2 -top-6 -translate-x-1/2 flex flex-col items-center justify-center w-14 h-14 bg-[#b5ffa2] border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all z-10"
              >
                <item.icon className="w-6 h-6 text-black stroke-[3px]" />
              </Link>
            );
          }

          // Leave a gap for the center button
          const isSecondItem = item.href === "/trending";
          const isFourthItem = item.href === "/saved";
          const extraClasses = isSecondItem ? "mr-4" : isFourthItem ? "ml-4" : "";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-12 h-12 text-black active:scale-95 transition-transform ${extraClasses}`}
            >
              <item.icon className="w-5 h-5 stroke-2" />
              <span className="font-display font-black text-[9px] uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
