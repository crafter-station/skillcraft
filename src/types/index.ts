export interface GenerateRequest {
  topic?: string;
  url?: string;
}

export interface GenerateResponse {
  content: string;
  sources: string[];
  metadata: {
    topic: string;
    scrapedCount: number;
    generatedAt: string;
  };
}

export interface BatchGenerateRequest {
  urls: string[];
}

export interface BatchResult {
  url: string;
  content: string;
  success: boolean;
  error?: string;
  duration?: number;
}

export interface BatchGenerateResponse {
  results: BatchResult[];
}

export interface ScrapedContent {
  url: string;
  markdown: string;
  success: boolean;
}

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}
