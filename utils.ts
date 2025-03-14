// utils.ts - Utility functions for the scrapers
import { CONFIG } from "./config.ts";

/**
 * Fetches HTML content from a URL with retry logic
 * @param url The URL to fetch
 * @returns Promise with the HTML content
 */
export async function fetchHtml(url: string): Promise<string> {
  let attempt = 0;
  
  while (attempt < CONFIG.network.retries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.network.timeout);
      
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      }
      
      return await response.text();
    } catch (error) {
      attempt++;
      console.warn(`Attempt ${attempt}/${CONFIG.network.retries} failed for ${url}: ${error}`);
      
      if (attempt >= CONFIG.network.retries) {
        console.error(`Failed to fetch ${url} after ${CONFIG.network.retries} attempts`);
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, CONFIG.network.retryDelay));
    }
  }
  
  throw new Error(`Failed to fetch ${url} after ${CONFIG.network.retries} attempts`);
}

/**
 * Resolves a relative URL to an absolute URL
 * @param baseUrl The base URL
 * @param relativeUrl The relative URL
 * @returns The absolute URL
 */
export function resolveUrl(baseUrl: string, relativeUrl?: string): string | undefined {
  if (!relativeUrl) return undefined;
  
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch (error) {
    console.warn(`Failed to resolve URL ${relativeUrl} against ${baseUrl}: ${error}`);
    return undefined;
  }
}

/**
 * Safely saves data to a JSON file
 * @param filename The filename to save to
 * @param data The data to save
 */
export async function saveToJson(filename: string, data: unknown): Promise<void> {
  try {
    await Deno.writeTextFile(filename, JSON.stringify(data, null, 2));
    console.log(`Successfully saved data to ${filename}`);
  } catch (error) {
    console.error(`Failed to save data to ${filename}: ${error}`);
    throw error;
  }
}