import { CONFIG } from "./config.ts";
import { scrapeDKNOAjax } from "./scrapers/dkno_ajax.ts";
import { scrapeKinoAjax } from "./scrapers/kino_ajax.ts";
import { scrapeNamestovoNews } from "./scrapers/namestovo_news.ts";
import { scrapeNamestovoTabula } from "./scrapers/namestovo_tabula.ts";

async function main() {
  try {
    console.log("Starting scrapers...");
    
    // Run all scrapers and collect results
    const [dknoEvents, kinoEvents, namestovoNews, namestovoTabula] = await Promise.all([
      scrapeDKNOAjax(1, CONFIG.pagination.kinoPageSize),
      scrapeKinoAjax(1, CONFIG.pagination.kinoPageSize),
      scrapeNamestovoNews(),
      scrapeNamestovoTabula()
    ]);
    
    // Print results
    console.log("\n===== DKNO Events =====");
    console.log(`Found ${dknoEvents.length} events`);
    dknoEvents.forEach(event => {
      console.log(`- ${event.title} (${event.dates.join(',')})`);
    });
    
    console.log("\n===== Kino Events =====");
    console.log(`Found ${kinoEvents.length} events`);
    kinoEvents.forEach(event => {
      console.log(`- ${event.title} (${event.dates.join(',')})`);
    });
    
    console.log("\n===== Namestovo News =====");
    console.log(`Found ${namestovoNews.length} news items`);
    namestovoNews.forEach(news => {
      console.log(`- ${news.title} (${news.date})`);
    });
    
    console.log("\n===== Namestovo Úradná tabuľa =====");
    console.log(`Found ${namestovoTabula.length} tabula items`);
    namestovoTabula.forEach(item => {
      console.log(`- ${item.title} (${item.date})`);
    });
    
    // Save results to JSON files
    await Deno.writeTextFile("output/dkno_events.json", JSON.stringify(dknoEvents, null, 2));
    await Deno.writeTextFile("output/kino_events.json", JSON.stringify(kinoEvents, null, 2));
    await Deno.writeTextFile("output/namestovo_news.json", JSON.stringify(namestovoNews, null, 2));
    await Deno.writeTextFile("output/namestovo_tabula.json", JSON.stringify(namestovoTabula, null, 2));
    
    console.log("\nData saved to JSON files.");
  } catch (error) {
    console.error("Error running scrapers:", error);
  }
}

console.log("test");
// Run the main function
if (import.meta.main) {
    console.log("test2");
    main();
  }