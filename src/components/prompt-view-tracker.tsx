"use client";

import { useEffect } from "react";

type PromptViewTrackerProps = {
  promptId: string;
};

export function PromptViewTracker({ promptId }: PromptViewTrackerProps) {
  useEffect(() => {
    fetch(`/api/prompts/${promptId}/view`, { method: "POST" });
  }, [promptId]);

  return null;
}
