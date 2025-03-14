# Deno Parser

A Deno-based web scraper project to extract information from various websites:

* Events from https://www.dkno.sk/ (using the AJAX API endpoint)
* Movie events from https://kino.dkno.sk/ (using the AJAX API endpoint)
* News ("aktuality") from https://www.namestovo.sk/sk/aktuality
* Official notices ("úradná tabuľa") from https://www.namestovo.sk/sk/uradna-tabula

## Prerequisites

1. Install [Deno](https://deno.land/#installation)
2. Clone this repository

## Project Structure

```
.
├── main.ts                  # Entry point
├── types.ts                 # Type definitions
├── utils.ts                 # Utility functions
├── config.ts                # Configuration settings
└── scrapers/
    ├── dkno_ajax.ts         # DKNO events ajax scraper
    ├── kino_ajax.ts         # KINO events ajax scraper
    ├── namestovo_news.ts    # Namestovo news scraper
    ├── namestovo_tabula.ts  # Namestovo tabula scraper
    └── ticketportal_ajax.ts # Base ajax utils and params definition
```

## Running the Project

### Run All Scrapers

```bash
# Run with network permissions
deno run --allow-net --allow-write main.ts
```

The script will:
1. Scrape all four websites
2. Display a summary of found items in the console
3. Save detailed results to JSON files:
   - `dkno_events.json`
   - `kino_events.json`
   - `namestovo_news.json`
   - `namestovo_tabula.json`

## Customizing the Scrapers

All scrapers use CSS selectors configured in `config.ts`. You can adjust these selectors based on the actual structure of the websites you're scraping.

## Important Notes

1. **Respect Website Terms**: Ensure your scraping activities comply with the terms of service of the websites you're scraping.
2. **Add Rate Limiting**: For production use, consider adding rate limiting to avoid overloading the target websites.
3. **Error Handling**: The current implementation has basic error handling. Consider enhancing it for production use.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)