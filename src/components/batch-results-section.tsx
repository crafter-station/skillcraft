"use client";

import { Button } from "@/components/ui/button";
import type { BatchResult } from "@/types";
import {
  CheckCircle2,
  Download,
  Eye,
  Loader2,
  XCircle,
} from "lucide-react";
import { useCallback } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface BatchResultsSectionProps {
  results: BatchResult[];
  onPreview: (content: string) => void;
}

export function BatchResultsSection({
  results,
  onPreview,
}: BatchResultsSectionProps) {
  const successCount = results.filter((r) => r.success).length;

  const handleDownloadAll = useCallback(async () => {
    const zip = new JSZip();
    for (const result of results) {
      if (!result.success) continue;
      const nameMatch = result.content.match(/^name:\s*(.+)$/m);
      const filename = nameMatch
        ? `${nameMatch[1].trim()}.md`
        : `skill-${results.indexOf(result)}.md`;
      zip.file(filename, result.content);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "skills.zip");
  }, [results]);

  return (
    <div className="flex w-full flex-col rounded-lg border-2 border-crafter-amber-dark/30 bg-card shadow-brutal dark:border-crafter-teal/30">
      <div className="flex items-center justify-between border-b-2 border-crafter-amber-dark/20 px-4 py-3 dark:border-crafter-teal/20">
        <span className="font-semibold text-sm">
          Results ({successCount}/{results.length})
        </span>
        {successCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadAll}
            className="gap-1.5 text-xs hover:text-crafter-amber-dark dark:hover:text-crafter-teal"
          >
            <Download className="size-3.5" />
            Download All (.zip)
          </Button>
        )}
      </div>
      <div className="divide-y-2 divide-crafter-amber-dark/10 dark:divide-crafter-teal/10">
        {results.map((result) => (
          <div
            key={result.url}
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {result.success ? (
                <CheckCircle2 className="size-5 shrink-0 text-crafter-teal" />
              ) : result.error ? (
                <XCircle className="size-5 shrink-0 text-red-600" />
              ) : (
                <Loader2 className="size-5 shrink-0 animate-spin text-crafter-amber" />
              )}
              <div className="min-w-0">
                <p className="truncate font-mono text-xs">{result.url}</p>
                {result.duration && (
                  <p className="text-muted-foreground text-xs">
                    {(result.duration / 1000).toFixed(1)}s
                  </p>
                )}
                {result.error && (
                  <p className="text-red-600 text-xs">{result.error}</p>
                )}
              </div>
            </div>
            {result.success && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPreview(result.content)}
                className="shrink-0 gap-1.5 text-xs hover:text-crafter-amber-dark dark:hover:text-crafter-teal"
              >
                <Eye className="size-3.5" />
                Preview
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
