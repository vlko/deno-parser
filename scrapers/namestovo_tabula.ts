import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { TabulaItem } from "../types.ts";
import { fetchHtml } from "../utils.ts";

/**
 * Scrapes a single news page and extracts the details
 * @param url URL of the news item page
 * @returns Promise with the parsed NewsItem
 */
async function scrapeNewsItemPage(url: string): Promise<TabulaItem | null> {
  try {
    console.log(`Fetching tabula item content from: ${url}`);
    const html = await fetchHtml(url);
    
    const document = new DOMParser().parseFromString(html, "text/html");
    if (!document) {
      throw new Error(`Failed to parse HTML from ${url}`);
    }
    
    // Extract title
    const titleElement = document.querySelector(".inner-article-index h2");
    const title = titleElement?.textContent?.trim() || url.split("/").pop() || "Unknown News";
    
    // Extract date
    const dateElement = document.querySelector(".inner-article-index .info-date");
    const date = dateElement?.textContent?.trim() || "";
    
    // Extract content/summary
    const contentElement = document.querySelector(".body-perex ~ .body-info");
    let summary = contentElement?.textContent?.trim() || "";
    
    // Limit summary length if needed
    if (summary.length > 500) {
      summary = summary.substring(0, 500) + "...";
    }
    
    
    return {
      title,
      date,
      summary,
      url
    };
  } catch (error) {
    console.error(`Error scraping tabula item from ${url}:`, error);
    return null;
  }
}

export async function scrapeNamestovoTabula(): Promise<TabulaItem[]> {
  const url = "https://www.namestovo.sk/sk/uradna-tabula";
  const html = await fetchHtml(url);
  
  const document = new DOMParser().parseFromString(html, "text/html");
  if (!document) throw new Error("Failed to parse HTML from namestovo.sk/uradna-tabula");
  
  const tabulaItems: TabulaItem[] = [];
  const tabulaUrls: string[] = [];
  
  // Targeting the tabula containers - adjust selectors based on actual website structure
  const tabulaElements = document.querySelectorAll(".body-messages .message");
  
  tabulaElements.forEach((element) => {
    // Get news URL
    const linkElement = element.querySelector("a");
    const relativeUrl = linkElement?.getAttribute("href");
    if (relativeUrl) {
      const url = new URL(relativeUrl, "https://www.namestovo.sk/").href;
      tabulaUrls.push(url);
    }
  });

  console.log(`Found ${tabulaUrls.length} news item URLs`);
  
  // Scrape each news item page
  for (const url of tabulaUrls) {
    const newsItem = await scrapeNewsItemPage(url);
    if (newsItem) {
      tabulaItems.push(newsItem);
      
      // Optional: Add a small delay to avoid overloading the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`Successfully scraped ${tabulaItems.length} out of ${tabulaItems.length} news items`);
  
  
  return tabulaItems;
}