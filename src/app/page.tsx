"use client";

import { BatchInputSection } from "@/components/batch-input-section";
import { BatchResultsSection } from "@/components/batch-results-section";
import { InputSection } from "@/components/input-section";
import { PreviewSection } from "@/components/preview-section";
import { ThemeToggle } from "@/components/theme-toggle";
import type {
  BatchGenerateResponse,
  BatchResult,
  GenerateResponse,
} from "@/types";
import { Github, Hammer, Layers, Terminal } from "lucide-react";
import { useState } from "react";

type Mode = "single" | "batch";

export default function Home() {
  const [mode, setMode] = useState<Mode>("single");
  const [topic, setTopic] = useState("");
  const [batchUrls, setBatchUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setGeneratedContent("");

    try {
      const isUrl = topic.trim().match(/^https?:\/\//);
      const body = isUrl ? { url: topic.trim() } : { topic: topic.trim() };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data: GenerateResponse = await res.json();
      setGeneratedContent(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleBatchGenerate() {
    setLoading(true);
    setError("");
    setBatchResults([]);
    setGeneratedContent("");

    const urls = batchUrls
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.match(/^https?:\/\//));

    setBatchResults(
      urls.map((url) => ({ url, content: "", success: false })),
    );

    try {
      const res = await fetch("/api/generate-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Batch generation failed");
      }

      const data: BatchGenerateResponse = await res.json();
      setBatchResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex w-full max-w-3xl flex-col items-center gap-8">
        <header className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center border-2 border-gold bg-gold/10 shadow-brutal-sm">
              <Hammer className="size-6 text-gold" />
            </div>
            <h1 className="font-bold text-4xl tracking-tight uppercase">
              <span className="text-gold">Skill</span>
              <span className="text-foreground">Craft</span>
            </h1>
          </div>
          <p className="max-w-md text-muted-foreground">
            Generate AI agent skills from any documentation URL. Open source,
            powered by Firecrawl and your choice of LLM.
          </p>
          <a
            href="https://github.com/crafter-station/skillcraft"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-muted-foreground text-xs transition-colors hover:text-gold"
          >
            <Github className="size-3.5" />
            crafter-station/skillcraft
          </a>
        </header>

        <div className="flex items-center gap-0 border-2 border-border">
          <button
            type="button"
            onClick={() => setMode("single")}
            className={`flex items-center gap-2 px-5 py-2.5 font-semibold text-sm transition-colors ${
              mode === "single"
                ? "bg-gold text-black"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Terminal className="size-4" />
            Single Skill
          </button>
          <div className="h-full w-[2px] bg-border" />
          <button
            type="button"
            onClick={() => setMode("batch")}
            className={`flex items-center gap-2 px-5 py-2.5 font-semibold text-sm transition-colors ${
              mode === "batch"
                ? "bg-gold text-black"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="size-4" />
            Batch Mode
          </button>
        </div>

        {mode === "single" ? (
          <InputSection
            value={topic}
            onChange={setTopic}
            onSubmit={handleGenerate}
            loading={loading}
          />
        ) : (
          <BatchInputSection
            value={batchUrls}
            onChange={setBatchUrls}
            onSubmit={handleBatchGenerate}
            loading={loading}
          />
        )}

        {error && (
          <div className="w-full border-2 border-destructive bg-destructive/10 px-4 py-3 text-destructive text-sm">
            {error}
          </div>
        )}

        {mode === "batch" && batchResults.length > 0 && (
          <BatchResultsSection
            results={batchResults}
            onPreview={setGeneratedContent}
          />
        )}

        {generatedContent && <PreviewSection content={generatedContent} />}

        <footer className="pb-8 text-center">
          <p className="text-muted-foreground text-xs">
            Open source by{" "}
            <a
              href="https://github.com/crafter-station"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gold underline-offset-4 transition-colors hover:underline"
            >
              Crafter Station
            </a>
            {" "}/ Powered by{" "}
            <a
              href="https://firecrawl.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Firecrawl
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
