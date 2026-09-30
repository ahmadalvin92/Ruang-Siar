export type ContentStatus = 'Draft' | 'Published' | 'Archived';

export interface RundownItem {
  time: string; // e.g. "00:00", "01:30"
  title: string; // e.g. "Pengantar Siaran Pagi", "Dan..."
  artistOrSpeaker?: string; // e.g. "Bang Rey", "Sheila on 7"
  type: 'siaran' | 'lagu';
}

export interface Broadcast {
  id: string;
  title: string;
  slug: string;
  description: string;
  youtubePlaylistUrl: string;
  thumbnailUrl: string;
  category: string;
  duration?: string;
  status: ContentStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  rundown?: RundownItem[];
}

export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  category: string;
  status: ContentStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BroadcastFormData {
  title: string;
  slug?: string;
  description: string;
  youtubePlaylistUrl: string;
  thumbnailUrl?: string;
  category?: string;
  duration?: string;
  status: ContentStatus;
  publishedAt?: string;
  rundownText?: string;
  rundown?: RundownItem[];
}

export interface NewsFormData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  thumbnailUrl?: string;
  category?: string;
  status: ContentStatus;
  publishedAt?: string;
}
