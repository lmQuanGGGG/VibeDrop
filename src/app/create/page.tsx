import { AppShell } from "@/components/app-shell";
import { PromptEditor } from "@/components/prompt-editor";
import { createPrompt } from "@/app/create/actions";
import { getPromptById } from "@/lib/queries/prompts";
import { SubmitButton } from "@/components/submit-button";

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
      <form
        action={createPrompt}
        className="bg-[#c8f560] border-4 border-black p-8 max-sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none space-y-6"
      >
        <PromptEditor 
          remixOf={remix ?? null} 
          defaultTitle={originalPrompt?.title ? `Remix: ${originalPrompt.title}` : undefined}
          defaultPrompt={originalPrompt?.prompt_text}
          defaultCategory={originalPrompt?.category}
          defaultTags={originalPrompt?.tags?.join(", ")}
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t-2 border-black mt-6">
          <SubmitButton
            label="Publish Drop"
            pendingLabel="Publishing..."
            className="w-full sm:w-auto py-3 px-6 bg-black text-white font-display font-black uppercase tracking-wider text-sm border-2 border-black hover:bg-neutral-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          />
          <p className="font-mono text-[10px] text-neutral-700 uppercase font-bold max-w-xs">
            Your prompt will appear on the public feed instantly.
          </p>
        </div>
      </form>
    </AppShell>
  );
}
