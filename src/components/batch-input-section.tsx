"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Layers, Loader2, Wand2 } from "lucide-react";

interface BatchInputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function BatchInputSection({
  value,
  onChange,
  onSubmit,
  loading,
}: BatchInputSectionProps) {
  const urlCount = value
    .split("\n")
    .filter((line) => line.trim().match(/^https?:\/\//)).length;

  return (
    <div className="flex w-full flex-col gap-3 rounded-lg border-2 border-black bg-white shadow-brutal dark:border-white dark:bg-black">
      <div className="flex items-center justify-between border-b-2 border-black px-4 py-3 dark:border-white">
        <div className="flex items-center gap-2">
          <Layers className="size-5 text-muted-foreground" />
          <span className="font-semibold text-sm">Batch URLs</span>
        </div>
        <span className="font-mono text-muted-foreground text-xs">
          {urlCount} URL{urlCount !== 1 ? "s" : ""} detected
        </span>
      </div>
      <div className="px-4 pb-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            "Paste URLs, one per line:\nhttps://docs.clerk.com/authentication\nhttps://supabase.com/docs/guides/auth"
          }
          className="min-h-[140px] resize-none border-0 bg-transparent font-mono text-sm shadow-none focus-visible:ring-0"
          disabled={loading}
        />
        <Button
          onClick={onSubmit}
          disabled={loading || urlCount === 0}
          className="mt-3 w-full gap-2 rounded-md border-2 border-black bg-black px-6 font-semibold text-white shadow-brutal-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none dark:border-white dark:bg-white dark:text-black"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Wand2 className="size-4" />
          )}
          Generate {urlCount} Skill{urlCount !== 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  );
}
