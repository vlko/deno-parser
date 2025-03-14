// scrape_kino_ajax.ts - Standalone script to scrape the kino AJAX endpoint
import { DOMParser, NodeList } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { CONFIG } from "../config.ts";
import { Event } from "../types.ts";
import { KinoAjaxResponse, fetchJson } from "./ticketportal_ajax.ts"

/**
 * Scrapes the kino AJAX endpoint for movie events
 * @param page The page number to fetch
 * @param itemsPerPage Number of items per page
 * @returns Promise with movie events
 */
export async function scrapeDKNOAjax(
  page: number = 1, 
  itemsPerPage: number = CONFIG.pagination.kinoPageSize
): Promise<Event[]> {
  const url = `https://www.dkno.sk/ajax/ajax_program_kina_rozsireny.php?strana=${page}&pocet_na_strane=${itemsPerPage}&sTab=&sTabID=&klient=173&kino=237&smid=92815&vychodzi_pohlad=`;
  
  console.log(`Fetching dkno data from ${url}`);
  
  // Fetch data from the AJAX endpoint
  const response = await fetchJson<KinoAjaxResponse>(url);
  
  const document = new DOMParser().parseFromString(response.html, "text/html");
   if (!document) throw new Error("Failed to parse HTML from dkno.sk");
   
     // Targeting the movie/event containers - adjust selectors based on actual website structure
  const movieElements = document.querySelectorAll(".media");
  
  // Map the response to MovieEvent objects
  const movieEvents: Event[] = [];
  
  movieElements.forEach((element) => {
    // Extract details - adjust selectors based on actual website structure
    const title = element.querySelector(".media-body h2")?.textContent?.trim() || "Unknown Movie";
    const dateElements = element.querySelectorAll("ul li");
    const dates: string[] = []
    dateElements.forEach((dateElement) => 
    {
      const dateParts = dateElement?.querySelectorAll("span");
      const date = dateParts ? [...dateParts as NodeList].map((node) => node?.textContent.trim()).join(' ') : "";
      dates.push(date);
    });
    
    // Get image URL if available
    const imgElement = element.querySelector("img");
    const imageUrl = imgElement?.getAttribute("src") || undefined;
    
    // Get event URL if available
    const linkElement = element.querySelector("a[href^=\"/klient\"]");
    const relativeUrl = linkElement?.getAttribute("href") || "";
    const url = relativeUrl ? new URL(relativeUrl, "https://dkno.sk/").href : undefined;
    
    // Extract description if available
    const descriptionElement = element.querySelector(".media-body p");
    const description = descriptionElement?.textContent?.trim();
    
    movieEvents.push({
      title,
      dates,
      description,
      location: "DKNO Namestovo",
      imageUrl,
      url
    });
  });
  
  return movieEvents;
}
