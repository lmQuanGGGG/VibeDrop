import { AppShell } from "@/components/app-shell";
import { CreatePromptForm } from "@/components/create-prompt-form";
import { getPromptById } from "@/lib/queries/prompts";

type CreatePageProps = {
  searchParams?: Promise<{ remix?: string }>;
};

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const { remix } = (await searchParams) ?? {};
  
  let originalPrompt = null;
  if (remix) {
    originalPrompt = await getPromptById(remix);
  }

  return (
    <AppShell
      title={originalPrompt ? "Remix Prompt" : "Drop New Vibe"}
      description="Unleash your creativity. Define the vibe, set the parameters, and inspire others."
    >
      <CreatePromptForm 
        remixOf={remix ?? null} 
        defaultTitle={originalPrompt?.title ? `Remix: ${originalPrompt.title}` : undefined}
        defaultPrompt={originalPrompt?.prompt_text}
        defaultCategory={originalPrompt?.category}
        defaultTags={originalPrompt?.tags?.join(", ")}
      />
    </AppShell>
  );
}
