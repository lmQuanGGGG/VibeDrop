"use client";

import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      title="Đăng xuất"
      className="flex items-center justify-center w-9 h-9 border-2 border-black bg-white hover:bg-red-50 hover:border-red-500 hover:text-red-600 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)] active:translate-y-0.5"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
