"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type PromptEditorProps = {
  defaultTitle?: string;
  defaultPrompt?: string;
  defaultResult?: string;
  defaultCategory?: string;
  defaultTags?: string;
  remixOf?: string | null;
};

export function PromptEditor({
  defaultTitle,
  defaultPrompt,
  defaultResult,
  defaultCategory,
  defaultTags,
  remixOf,
}: PromptEditorProps) {
  const [fileName, setFileName] = useState("");
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Prompt title</label>
        <Input
          name="title"
          placeholder="Neon cyberpunk street chase"
          defaultValue={defaultTitle}
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <label className="font-medium">Detailed prompt</label>
          <span className="text-xs text-muted-foreground">
            AI optimized · Markdown supported
          </span>
        </div>
        <Textarea
          name="promptText"
          rows={7}
          placeholder="Describe the vibe, lens, lighting, and energy."
          defaultValue={defaultPrompt}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">AI result (optional)</label>
        <Textarea
          name="resultText"
          rows={4}
          placeholder="Paste the AI response or summary."
          defaultValue={defaultResult}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Reference thumbnail</label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-none border-2 border-black bg-white px-4 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
          <label className="flex items-center gap-3 cursor-pointer group">
            <span className="font-mono text-xs font-bold text-white bg-black px-3 py-2 border-2 border-black group-hover:bg-white group-hover:text-black transition-colors uppercase">
              Choose Image
            </span>
            <span className="text-sm font-mono text-neutral-600 line-clamp-1 break-all">
              {fileName || "No file chosen"}
            </span>
            <input 
              name="preview" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFileName(file.name);
                } else {
                  setFileName("");
                }
              }}
            />
          </label>
          <span className="font-mono text-xs font-bold text-black bg-neutral-100 px-2 py-1 border border-black uppercase flex-shrink-0">Optional</span>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Primary category</label>
          <Input
            name="category"
            placeholder="coding, vibe, image..."
            defaultValue={defaultCategory}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <Input
            name="tags"
            placeholder="neon, camera, street"
            defaultValue={defaultTags}
          />
        </div>
      </div>
      {remixOf ? <input type="hidden" name="remixOf" value={remixOf} /> : null}
    </div>
  );
}
