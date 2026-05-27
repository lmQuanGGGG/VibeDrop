import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PromptEditor } from "@/components/prompt-editor";
import { getPromptById } from "@/lib/queries/prompts";
import { updatePrompt, deletePrompt } from "@/app/create/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function EditPromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    redirect("/login");
  }

  const prompt = await getPromptById(id);

  if (!prompt) {
    notFound();
  }

  // Double check ownership
  if (prompt.user_id !== auth.user.id) {
    redirect("/");
  }

  const updateAction = updatePrompt.bind(null, prompt.id);
  const deleteAction = deletePrompt.bind(null, prompt.id);

  return (
    <AppShell
      title="Edit Prompt"
      description="Refine your vibe and update your parameters."
    >
      <div className="space-y-6">
        <form
          action={updateAction}
          className="bg-[#c8f560] border-4 border-black p-8 max-sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none space-y-6"
        >
          <PromptEditor 
            defaultTitle={prompt.title}
            defaultPrompt={prompt.prompt_text}
            defaultResult={prompt.result_text ?? undefined}
            defaultCategory={prompt.category}
            defaultTags={prompt.tags?.join(", ")}
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t-2 border-black mt-6">
            <button 
              type="submit" 
              className="w-full sm:w-auto py-3 px-6 bg-black text-white font-display font-black uppercase tracking-wider text-sm border-2 border-black hover:bg-neutral-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              Save Changes
            </button>
            <p className="font-mono text-[10px] text-neutral-700 uppercase font-bold max-w-xs">
              Your prompt will be updated instantly on the feed.
            </p>
          </div>
        </form>

        <form 
          action={deleteAction}
          className="bg-[#ffb4a2] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none space-y-4"
        >
          <h2 className="font-display font-black text-xl uppercase tracking-wide text-black">Danger Zone</h2>
          <p className="font-sans text-sm text-neutral-800">
            Deleting this prompt will permanently remove it from the public feed, and all associated stats (copies, saves, votes) will be lost.
          </p>
          <button 
            type="submit"
            className="w-full sm:w-auto py-2.5 px-5 bg-red-600 text-white font-display font-black uppercase tracking-wider text-sm border-2 border-black hover:bg-red-700 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            Delete Permanently
          </button>
        </form>
      </div>
    </AppShell>
  );
}
