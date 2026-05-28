"use client";

import { useState } from "react";
import { PromptEditor } from "@/components/prompt-editor";
import { SubmitButton } from "@/components/submit-button";
import { uploadImageToR2 } from "@/lib/upload-r2";
import { createPrompt } from "@/app/(main)/create/actions";

type CreatePromptFormProps = {
  remixOf: string | null;
  defaultTitle?: string;
  defaultPrompt?: string;
  defaultCategory?: string;
  defaultTags?: string;
};

export function CreatePromptForm(props: CreatePromptFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    setErrorMsg("");
    
    try {
      const file = formData.get("preview") as File | null;
      
      // If a file was selected, upload it to R2 first
      if (file && file.size > 0) {
        const { key, publicUrl } = await uploadImageToR2(file, "prompts");
        // Append R2 data to the form
        formData.append("thumbnailUrl", publicUrl);
        formData.append("thumbnailKey", key);
      }
      
      // We don't need to send the raw file to the server anymore
      formData.delete("preview");
      
      // Execute the server action
      await createPrompt(formData);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "An error occurred while publishing.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="bg-[#c8f560] border-4 border-black p-8 max-sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none space-y-6"
    >
      <PromptEditor {...props} />
      
      {errorMsg && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-2 text-sm font-bold font-mono">
          {errorMsg}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t-2 border-black mt-6">
        <SubmitButton
          label="Publish Drop"
          pendingLabel={isUploading ? "Uploading..." : "Publishing..."}
          className="w-full sm:w-auto py-3 px-6 bg-black text-white font-display font-black uppercase tracking-wider text-sm border-2 border-black hover:bg-neutral-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
        />
        <p className="font-mono text-[10px] text-neutral-700 uppercase font-bold max-w-xs">
          Your prompt will appear on the public feed instantly.
        </p>
      </div>
    </form>
  );
}
