import { PromptCard } from "@/components/prompt-card";
import { PromptWithStats } from "@/lib/queries/prompts";

type PromptFeedProps = {
  prompts: PromptWithStats[];
  emptyMessage?: string;
};

export function PromptFeed({ prompts, emptyMessage }: PromptFeedProps) {
  if (!prompts.length) {
    return (
      <div className="border-4 border-black bg-white p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none">
        <span className="material-symbols-outlined text-4xl text-neutral-300 block mb-4">
          search_off
        </span>
        <p className="font-sans font-bold text-sm text-neutral-600">
          {emptyMessage ?? "No matches found in the aesthetic collective."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {prompts.map((prompt, index) => (
        <div
          key={prompt.id}
          className="animate-rise-in"
          style={{ animationDelay: `${index * 70}ms` }}
        >
          <PromptCard prompt={prompt} />
        </div>
      ))}
    </div>
  );
}
