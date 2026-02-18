import { chatCompletion } from "@/lib/openrouter";

export async function generateText(
  prompt: string,
  options?: { model?: string; temperature?: number; maxTokens?: number }
): Promise<string> {
  return chatCompletion(prompt, {
    model: options?.model ?? "google/gemini-2.5-flash",
    temperature: options?.temperature ?? 0.7,
    maxTokens: options?.maxTokens ?? 8192,
  });
}

export async function generatePro(prompt: string): Promise<string> {
  return chatCompletion(prompt, {
    model: "google/gemini-2.5-flash",
    temperature: 0.8,
    maxTokens: 16384,
  });
}

export async function generateFlash(prompt: string): Promise<string> {
  return chatCompletion(prompt, {
    model: "google/gemini-2.5-flash",
    temperature: 0.4,
    maxTokens: 8192,
  });
}
