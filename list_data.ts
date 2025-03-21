import { loadEvents, loadNewsItems, loadTabulaItems } from "./store/data_store.ts"

async function listData() {
    try {
        console.log("Loading scrapped data...");
        // Run all data loaders and collect results
        const [dknoEvents, kinoEvents, namestovoNews, namestovoTabula] = await Promise.all([
            loadEvents("dkno"),
            loadEvents("kino"),
            loadNewsItems(),
            loadTabulaItems()
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
    } catch (error) {
        console.error("Error running scrapers:", error);
    }
}

// Run the main function
if (import.meta.main) {
    listData();
}