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
    <div className="flex w-full flex-col border-2 border-border bg-card shadow-brutal">
      <div className="flex items-center justify-between border-b-2 border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="size-3 bg-gold" />
            <div className="size-3 bg-gold/60" />
            <div className="size-3 bg-gold/30" />
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
            className="gap-1.5 text-xs hover:text-gold"
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
            className="gap-1.5 text-xs hover:text-gold"
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
                  className="!border-2 !border-border"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code
                  className="bg-gold/10 px-1.5 py-0.5 font-mono text-gold text-sm"
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
