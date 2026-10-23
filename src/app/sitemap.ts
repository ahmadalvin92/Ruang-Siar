import { MetadataRoute } from 'next';
import { getBroadcasts, getNewsList } from '@/lib/data/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ruangsiar.id';

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    '',
    '/siaran',
    '/berita',
    '/tentang',
    '/kontak',
    '/redaksi',
    '/kebijakan-privasi',
    '/syarat-ketentuan',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic broadcast routes
  try {
    const broadcasts = await getBroadcasts({ status: 'Published' });
    const broadcastRoutes = broadcasts.map((b) => ({
      url: `${baseUrl}/siaran/${b.slug}`,
      lastModified: new Date(b.updatedAt || b.createdAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    routes.push(...broadcastRoutes);
  } catch (error) {
    console.error('Error generating broadcast sitemap:', error);
  }

  // Dynamic news routes
  try {
    const newsList = await getNewsList({ status: 'Published' });
    const newsRoutes = newsList.map((n) => ({
      url: `${baseUrl}/berita/${n.slug}`,
      lastModified: new Date(n.updatedAt || n.createdAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    routes.push(...newsRoutes);
  } catch (error) {
    console.error('Error generating news sitemap:', error);
  }

  return routes;
}
