export const CONFIG = {
    
    // Network settings
    network: {
      timeout: 30000,  // Request timeout in milliseconds
      retries: 3,      // Number of retries for failed requests
      retryDelay: 1000, // Delay between retries in milliseconds
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    },
    
    // Pagination settings
    pagination: {
      kinoPageSize: 100 // Number of items per page for kino scraper
    }
  };