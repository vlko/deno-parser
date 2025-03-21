import { Event, NewsItem, TabulaItem } from "../types.ts";

const kv = await Deno.openKv();

/**
 * Stores events with prefix to store
 * @param prefix event prefix
 * @param events events to store
 * @returns Promise with bool if successfull
 */
export async function storeEvents(prefix: string, events: Event[]): Promise<boolean> {
    try {
        for (const evnt of events) {
            await kv.set(["events_" + prefix, evnt.url], evnt);
        }
        return true;
    } catch (error) {
        console.error(`Error storing data for events_${prefix}:`, error);
        return false;
    }
}

/**
 * Stores news items to store
 * @param items news items to store
 * @returns Promise with bool if successfull
 */
export async function storeNewsItems(items: NewsItem[]): Promise<boolean> {
    try {
        for (const item of items) {
            await kv.set(["news", item.url], item);
        }
        return true;
    } catch (error) {
        console.error(`Error storing data for news items:`, error);
        return false;
    }
}
/**
 * Stores tabula items to store
 * @param items tabula items to store
 * @returns Promise with bool if successfull
 */
export async function storeTabulaItems(items: TabulaItem[]): Promise<boolean> {
    try {
        for (const item of items) {
            await kv.set(["tabula", item.url], item);
        }
        return true;
    } catch (error) {
        console.error(`Error storing data for tabula items:`, error);
        return false;
    }
}

export async function loadEvents(prefix: string, urls?: string[]): Promise<Event[]> {
    try {
        const results: Event[] = [];
        // load by idents
        if (urls) {
            for (const url of urls) {
                const record = await kv.get(["events_" + prefix, url]);
                const item: Event = record.value as Event;
                if (item) {
                    results.push(item);
                }
            }
        }
        // else load all
        {
            const records = kv.list({ prefix: ["events_" + prefix] });
            for await (const res of records) {
                results.push(res.value as Event);
            }
        }
        return results;
    } catch (error) {
        console.error(`Error loading data for events_${prefix}:`, error);
    }
    return [];
}

export async function loadNewsItems(urls?: string[]): Promise<NewsItem[]> {
    try {
        const results: NewsItem[] = [];
        // load by idents
        if (urls) {
            for (const url of urls) {
                const record = await kv.get(["news", url]);
                const item: NewsItem = record.value as NewsItem;
                if (item) {
                    results.push(item);
                }
            }
        }
        // else load all
        {
            const records = kv.list({ prefix: ["news"] });
            for await (const res of records) {
                results.push(res.value as NewsItem);
            }
        }
        return results;
    } catch (error) {
        console.error(`Error loading data for news items:`, error);
    }
    return [];
}

export async function loadTabulaItems(urls?: string[]): Promise<TabulaItem[]> {
    try {
        const results: TabulaItem[] = [];
        // load by idents
        if (urls) {
            for (const url of urls) {
                const record = await kv.get(["tabula", url]);
                const item: TabulaItem = record.value as TabulaItem;
                if (item) {
                    results.push(item);
                }
            }
        }
        // else load all
        {
            const records = kv.list({ prefix: ["tabula"] });
            for await (const res of records) {
                results.push(res.value as TabulaItem);
            }
        }
        return results;
    } catch (error) {
        console.error(`Error loading data for tabula items:`, error);
    }
    return [];
}