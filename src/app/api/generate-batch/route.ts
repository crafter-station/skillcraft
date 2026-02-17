import { scrapeUrl } from "@/lib/firecrawl";
import { generateSkill } from "@/lib/generate";
import type { BatchGenerateRequest, BatchGenerateResponse } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BatchGenerateRequest;
    const { urls } = body;

    if (!urls || urls.length === 0) {
      return NextResponse.json(
        { error: "urls array is required" },
        { status: 400 },
      );
    }

    if (urls.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 URLs per batch" },
        { status: 400 },
      );
    }

    const results = await Promise.allSettled(
      urls.map(async (url) => {
        const start = Date.now();
        const scraped = await scrapeUrl(url);

        if (!scraped.success) {
          return {
            url,
            content: "",
            success: false,
            error: "Failed to scrape URL",
            duration: Date.now() - start,
          };
        }

        const content = await generateSkill(url, [scraped]);
        return {
          url,
          content,
          success: true,
          duration: Date.now() - start,
        };
      }),
    );

    const response: BatchGenerateResponse = {
      results: results.map((result, i) => {
        if (result.status === "fulfilled") {
          return result.value;
        }
        return {
          url: urls[i],
          content: "",
          success: false,
          error: result.reason?.message || "Unknown error",
        };
      }),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Batch generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate batch" },
      { status: 500 },
    );
  }
}
