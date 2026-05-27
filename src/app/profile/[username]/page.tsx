import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PromptFeed } from "@/components/prompt-feed";
import { getPromptsByUserId } from "@/lib/queries/prompts";
import { getProfileByUsername } from "@/lib/queries/profile";

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

  const prompts = await getPromptsByUserId(profile.id);

  return (
    <AppShell
      title={profile.display_name || profile.username}
      description={profile.bio || "Prompt creator at VibeDrop"}
    >
      <PromptFeed
        prompts={prompts}
        emptyMessage="No prompts yet from this creator."
      />
    </AppShell>
  );
}
