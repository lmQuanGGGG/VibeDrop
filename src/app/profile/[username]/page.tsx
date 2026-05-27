import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ProfileFeed } from "@/components/profile-feed";
import { getPromptsByUserId } from "@/lib/queries/prompts";
import { getProfileByUsername } from "@/lib/queries/profile";
import { MapPin, Link as LinkIcon, Calendar, Pencil } from "lucide-react";
import { getCachedAuthUser } from "@/lib/supabase/server";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const { user } = await getCachedAuthUser();
  const isOwner = user?.id === profile.id;

  const prompts = await getPromptsByUserId(profile.id);
  const displayName = profile.display_name || profile.username;
  // Bỏ dấu để tránh lỗi font chữ trên tiêu đề lớn
  const displayNameNoAccent = displayName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
  const totalVotes = prompts.reduce((acc, p) => acc + p.voteScore, 0);

  return (
    <AppShell>
      {/* Massive Hero Header */}
      <div className="relative mb-12">
        {/* Abstract Cover Background */}
        <div className="absolute inset-0 bg-[#c8f560] border-b-8 border-black -mx-4 sm:-mx-8 lg:-mx-12 h-64 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-50">
           <div className="font-display font-black text-black/10 text-[150px] leading-none select-none tracking-tighter mix-blend-overlay">
             {profile.username.toUpperCase()}
           </div>
        </div>

        <div className="relative z-10 pt-32 px-4 flex flex-col md:flex-row items-end md:items-center gap-8">
          <div className="w-40 h-40 border-8 border-black bg-white flex-shrink-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden">
             {profile.avatar_url ? (
               <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
             ) : (
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} alt={displayName} className="w-full h-full object-cover" />
             )}
          </div>
          
          <div className="flex flex-col gap-3 flex-grow">
            <div>
              <h1 className="font-display font-black text-5xl sm:text-6xl uppercase tracking-tight text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">
                {displayNameNoAccent}
              </h1>
              <div className="font-mono text-lg font-bold bg-black text-white inline-block px-3 py-1 mt-2">
                @{profile.username}
              </div>
            </div>

            <p className="font-sans text-neutral-800 text-lg max-w-2xl font-bold bg-white/80 p-2 border-2 border-transparent hover:border-black transition-colors">
              {profile.bio || "Prompt creator at VibeDrop, sharing aesthetics and functional code."}
            </p>
          </div>

          <div className="flex md:flex-col gap-4 w-full md:w-auto">
            <div className="flex flex-col items-center justify-center border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full md:w-32">
               <span className="font-display font-black text-3xl">{prompts.length}</span>
               <span className="font-mono text-[10px] font-black uppercase">Prompts</span>
            </div>
            <div className="flex flex-col items-center justify-center border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full md:w-32">
               <span className="font-display font-black text-3xl text-[#f751a1]">{totalVotes}</span>
               <span className="font-mono text-[10px] font-black uppercase">Upvotes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="border-t-4 border-black pt-8 mt-8">
        <h2 className="font-display font-black text-3xl uppercase tracking-wider mb-8 flex justify-between items-end">
          <span>The Portfolio</span>
          {isOwner && (
            <span className="font-mono text-sm font-bold text-neutral-500 bg-neutral-100 px-2 py-1 border border-neutral-300">
              Editing Enabled
            </span>
          )}
        </h2>
        <ProfileFeed
          prompts={prompts}
          isOwner={isOwner}
          emptyMessage="No prompts yet from this creator."
        />
      </div>
    </AppShell>
  );
}
