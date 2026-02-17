import type { ScrapedContent } from "@/types";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

const SYSTEM_PROMPT = `You are an expert at creating SKILL.md files for AI coding agents (specifically Claude Code).

A SKILL.md file is a structured document that teaches an AI agent how to perform a specific task. It follows this format:

---
name: kebab-case-name (max 64 chars)
description: >-
  A description that tells the AI WHEN to activate this skill.
  Include trigger phrases like "Use when the user asks about X"
  or "Use when the user wants to Y". Max 1024 chars.
---

# Skill Name

## Overview
Brief description of what this skill does.

## When to Use
- Trigger condition 1
- Trigger condition 2

## Instructions
Step-by-step instructions in imperative form.

## Key Information
Important details, APIs, patterns, code examples.

## Examples
Concrete usage examples with code blocks.

## Sources
- [Source 1](url)
- [Source 2](url)

RULES:
1. The \`name\` field MUST be kebab-case, max 64 characters
2. The \`description\` field MUST explain when to activate, max 1024 characters
3. Instructions MUST be imperative ("Do X", "Use Y", not "You should do X")
4. Include real code examples from the scraped documentation
5. Keep it under 500 lines
6. Focus on actionable knowledge, not theory
7. Include source URLs at the bottom`;

function getModel() {
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic("claude-sonnet-4-5-20250929");
  }
  return openai("gpt-4o");
}

export async function generateSkill(
  topic: string,
  scrapedData: ScrapedContent[],
): Promise<string> {
  const context = scrapedData
    .map(
      (data, i) =>
        `Source ${i + 1}: ${data.url}\n${data.markdown.slice(0, 15000)}\n---`,
    )
    .join("\n\n");

  const { text } = await generateText({
    model: getModel(),
    system: SYSTEM_PROMPT,
    prompt: `Create a SKILL.md file for the topic: "${topic}"

Here is the documentation content scraped from relevant sources:

${context}

Generate a comprehensive, well-structured SKILL.md that an AI coding agent can use to help developers with this topic. Include practical code examples from the documentation.`,
    temperature: 0.5,
    maxOutputTokens: 4000,
  });

  return text;
}
