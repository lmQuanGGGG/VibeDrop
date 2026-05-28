import { CreatePromptForm } from "@/components/create-prompt-form";
import { getPromptById } from "@/lib/queries/prompts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Prompt",
  description: "Share your best AI prompts with the community. Let others copy and remix them, and see your creation rise to the trending feed.",
  robots: {
    index: false,
  },
};


type CreatePageProps = {
  searchParams?: Promise<{ remix?: string }>;
};

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const { remix } = (await searchParams) ?? {};
  
  let originalPrompt = null;
  if (remix) {
    originalPrompt = await getPromptById(remix);
  }

  const title = originalPrompt ? "Remix Prompt" : "Drop New Vibe";
  const description = "Unleash your creativity. Define the vibe, set the parameters, and inspire others.";

  return (
    <>
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-display font-black uppercase tracking-wide">{title}</h1>
        <p className="text-sm font-sans text-neutral-600">{description}</p>
      </div>
      <CreatePromptForm 
        remixOf={remix ?? null} 
        defaultTitle={originalPrompt?.title ? `Remix: ${originalPrompt.title}` : undefined}
        defaultPrompt={originalPrompt?.prompt_text}
        defaultCategory={originalPrompt?.category}
        defaultTags={originalPrompt?.tags?.join(", ")}
      />
    </>
  );
}
