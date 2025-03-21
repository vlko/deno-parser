export interface Event {
  title: string;
  dates: string[];
  location?: string;
  description?: string;
  imageUrl?: string;
  url: string;
}


export interface NewsItem {
  title: string;
  date: string;
  summary?: string;
  imageUrl?: string;
  url: string;
}

export interface TabulaItem {
  title: string;
  date: string;
  summary?: string;
  category?: string;
  url: string;
}