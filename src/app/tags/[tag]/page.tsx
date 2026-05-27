import { AppShell } from "@/components/app-shell";
import { PromptFeed } from "@/components/prompt-feed";
import { getPromptsByTag } from "@/lib/queries/prompts";

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const prompts = await getPromptsByTag(tag);

  return (
    <AppShell
      title={`#${tag}`}
      description="Prompts tagged by the community"
    >
      <PromptFeed
        prompts={prompts}
        emptyMessage="No prompts for this tag yet."
      />
    </AppShell>
  );
}
