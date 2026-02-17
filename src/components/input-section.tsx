"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Terminal, Wand2 } from "lucide-react";

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function InputSection({
  value,
  onChange,
  onSubmit,
  loading,
}: InputSectionProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex w-full items-center gap-2 border-2 border-border bg-card p-2 shadow-brutal"
    >
      <Terminal className="ml-2 size-5 shrink-0 text-gold" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Enter a topic (e.g. "Supabase Auth") or paste a URL...'
        className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
        disabled={loading}
      />
      <Button
        type="submit"
        disabled={loading || !value.trim()}
        className="shrink-0 gap-2 border-2 border-gold bg-gold px-6 font-semibold text-black shadow-brutal-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:brightness-110 hover:shadow-none"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Wand2 className="size-4" />
        )}
        Craft
      </Button>
    </form>
  );
}
