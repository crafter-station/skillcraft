import type { ScrapedContent } from "@/types";

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const FIRECRAWL_BASE_URL = "https://api.firecrawl.dev/v1";

async function firecrawlRequest(
  endpoint: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  const res = await fetch(`${FIRECRAWL_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firecrawl API error: ${res.status} ${text}`);
  }

  return res.json();
}

export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  try {
    const data = (await firecrawlRequest("/scrape", {
      url,
      formats: ["markdown"],
      onlyMainContent: true,
    })) as { success: boolean; data?: { markdown?: string } };

    return {
      url,
      markdown: data.data?.markdown || "",
      success: data.success && !!data.data?.markdown,
    };
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, error);
    return { url, markdown: "", success: false };
  }
}

export async function scrapeUrls(urls: string[]): Promise<ScrapedContent[]> {
  const results = await Promise.all(urls.map(scrapeUrl));
  return results.filter((r) => r.success && r.markdown.length > 0);
}

export async function searchAndScrape(
  query: string,
): Promise<{ results: ScrapedContent[]; searchUrls: string[] }> {
  const searchData = (await firecrawlRequest("/search", {
    query,
    limit: 3,
  })) as {
    success: boolean;
    data?: Array<{ url: string; markdown?: string }>;
  };

  if (!searchData.success || !searchData.data) {
    return { results: [], searchUrls: [] };
  }

  const searchUrls = searchData.data.map((r) => r.url);

  const results: ScrapedContent[] = searchData.data
    .filter((r) => r.markdown && r.markdown.length > 0)
    .map((r) => ({
      url: r.url,
      markdown: r.markdown || "",
      success: true,
    }));

  if (results.length === 0) {
    const scraped = await scrapeUrls(searchUrls);
    return { results: scraped, searchUrls };
  }

  return { results, searchUrls };
}
