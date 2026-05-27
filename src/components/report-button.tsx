"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

type ReportButtonProps = {
  promptId: string;
};

export function ReportButton({ promptId }: ReportButtonProps) {
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onReport = () => {
    startTransition(async () => {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId, reason: "Inappropriate content" }),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.ok) {
        setSent(true);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onReport}
      disabled={isPending || sent}
    >
      <Flag className="mr-2 h-4 w-4" />
      {sent ? "Reported" : "Report"}
    </Button>
  );
}
