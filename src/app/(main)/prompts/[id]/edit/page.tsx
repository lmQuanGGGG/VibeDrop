import { notFound, redirect } from "next/navigation";
import { EditPromptForm } from "@/components/edit-prompt-form";
import { getPromptById } from "@/lib/queries/prompts";
import { deletePrompt } from "@/app/(main)/create/actions";
import { getCachedAuthUser } from "@/lib/supabase/server";

export default async function EditPromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const { user } = await getCachedAuthUser();

  if (!user) {
    redirect("/login");
  }

  const prompt = await getPromptById(id);

  if (!prompt) {
    notFound();
  }

  // Double check ownership
  if (prompt.user_id !== user.id) {
    redirect("/");
  }

  const deleteAction = deletePrompt.bind(null, prompt.id);

  return (
    <>
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-display font-black uppercase tracking-wide">Edit Prompt</h1>
        <p className="text-sm font-sans text-neutral-600">Refine your vibe and update your parameters.</p>
      </div>
      <div className="space-y-6">
        <EditPromptForm 
          promptId={prompt.id}
          defaultTitle={prompt.title}
          defaultPrompt={prompt.prompt_text}
          defaultResult={prompt.result_text ?? undefined}
          defaultCategory={prompt.category}
          defaultTags={prompt.tags?.join(", ")}
          remixOf={prompt.remix_of}
        />

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
    </>
  );
}
