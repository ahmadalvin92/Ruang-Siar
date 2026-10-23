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

export interface ScheduleItem {
  time: string;
  name: string;
  color: string;
}

export interface RedaksiMember {
  role: string;
  name: string;
  bio?: string;
}

export interface AboutPrinciple {
  title: string;
  desc: string;
}

export interface AboutStep {
  title: string;
  desc: string;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  instagramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  whatsappNumber?: string;
  contactEmail: string;
  contactLocation: string;
  activeStatusText: string;
  schedules: ScheduleItem[];
  adSensePublisherId?: string;
  adSenseSlotLeaderboard?: string;
  adSenseSlotRectangle?: string;
  adSenseEnabled?: boolean;
  googleAnalyticsId?: string;

  // Custom Content: Tentang Kami
  aboutBadge?: string;
  aboutHeading?: string;
  aboutParagraph1?: string;
  aboutParagraph2?: string;
  aboutPrinciples?: AboutPrinciple[];
  aboutStepsHeading?: string;
  aboutSteps?: AboutStep[];
  aboutCtaHeading?: string;

  // Custom Content: Redaksi
  redaksiTitle?: string;
  redaksiDescription?: string;
  redaksiMembers?: RedaksiMember[];

  // Custom Content: Beranda
  statsListeners?: string;
  statsCuratedSongs?: string;
  conceptHeading?: string;
  conceptDescription?: string;
}
