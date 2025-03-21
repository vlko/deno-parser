import { CONFIG } from "./config.ts";
import { scrapeDKNOAjax } from "./scrapers/dkno_ajax.ts";
import { scrapeKinoAjax } from "./scrapers/kino_ajax.ts";
import { scrapeNamestovoNews } from "./scrapers/namestovo_news.ts";
import { scrapeNamestovoTabula } from "./scrapers/namestovo_tabula.ts";
import { storeEvents, storeNewsItems, storeTabulaItems } from "./store/data_store.ts"

async function updateData() {
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

    // Save results to store
    await storeEvents("dkno", dknoEvents);
    await storeEvents("kino", kinoEvents);
    await storeNewsItems(namestovoNews);
    await storeTabulaItems(namestovoTabula);

    console.log("\nData saved to store.");
  } catch (error) {
    console.error("Error running scrapers:", error);
  }
}

// Run the main function
if (import.meta.main) {
  updateData();
}