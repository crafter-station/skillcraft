import { scrapeUrls, searchAndScrape } from "@/lib/firecrawl";
import { generateSkill } from "@/lib/generate";
import type { GenerateRequest, GenerateResponse } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;
    const { topic, url } = body;

    if (!topic && !url) {
      return NextResponse.json(
        { error: "Either topic or url is required" },
        { status: 400 },
      );
    }

    let scrapedData;
    let sources: string[];
    const resolvedTopic = topic || url || "";

    if (url) {
      scrapedData = await scrapeUrls([url]);
      sources = [url];
    } else {
      const { results, searchUrls } = await searchAndScrape(resolvedTopic);
      scrapedData = results;
      sources = searchUrls;
    }

    if (scrapedData.length === 0) {
      return NextResponse.json(
        { error: "Failed to scrape any content from the provided sources" },
        { status: 422 },
      );
    }

    const content = await generateSkill(resolvedTopic, scrapedData);

    const response: GenerateResponse = {
      content,
      sources,
      metadata: {
        topic: resolvedTopic,
        scrapedCount: scrapedData.length,
        generatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate skill" },
      { status: 500 },
    );
  }
}
