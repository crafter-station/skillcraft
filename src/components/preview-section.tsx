"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy, Download } from "lucide-react";
import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface PreviewSectionProps {
  content: string;
}

export function PreviewSection({ content }: PreviewSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  const handleDownload = useCallback(() => {
    const nameMatch = content.match(/^name:\s*(.+)$/m);
    const filename = nameMatch
      ? `${nameMatch[1].trim()}.md`
      : "SKILL.md";
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [content]);

  return (
    <div className="flex w-full flex-col rounded-lg border-2 border-black bg-white shadow-brutal dark:border-white dark:bg-black">
      <div className="flex items-center justify-between border-b-2 border-black px-4 py-3 dark:border-white">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-500" />
            <div className="size-3 rounded-full bg-yellow-500" />
            <div className="size-3 rounded-full bg-green-500" />
          </div>
          <span className="font-mono text-muted-foreground text-xs">
            SKILL.md
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 text-xs"
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="gap-1.5 text-xs"
          >
            <Download className="size-3.5" />
            Download
          </Button>
        </div>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none overflow-auto p-6">
        <ReactMarkdown
          components={{
            code(props) {
              const { children, className, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  className="!rounded-md !border-2 !border-black dark:!border-white"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code
                  className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
                  {...rest}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
