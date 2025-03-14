import { CONFIG } from "../config.ts";
// Interface for the AJAX response from the kino endpoint
export interface KinoAjaxResponse {
  stav: string,
  html: string
}

/**
 * Fetches JSON data from the AJAX endpoint
 * @param url The URL to fetch
 * @returns Promise with the parsed JSON data
 */
export async function fetchJson<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": CONFIG.network.userAgent,
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}