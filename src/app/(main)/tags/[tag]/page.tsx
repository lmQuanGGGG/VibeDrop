import { PromptFeed } from "@/components/prompt-feed";
import { getPromptsByTag } from "@/lib/queries/prompts";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const title = `Prompts tagged with #${decodedTag}`;
  const description = `Discover and copy AI prompts tagged with #${decodedTag} on VibeDrop. Browse top collections.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/tags/${tag}`,
    },
  };
}


export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const prompts = await getPromptsByTag(decodedTag);

  return (
    <>
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-display font-black uppercase tracking-wide">#{decodedTag}</h1>
        <p className="text-sm font-sans text-neutral-600">Prompts tagged with #{decodedTag}</p>
      </div>
      <PromptFeed prompts={prompts} />
    </>
  );
}
