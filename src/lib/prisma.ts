/**
 * Prisma Database Client Configuration
 * Prepared for PostgreSQL deployment
 */

export interface PrismaConfig {
  databaseUrl?: string;
  isConfigured: boolean;
}

export const prismaConfig: PrismaConfig = {
  databaseUrl: process.env.DATABASE_URL,
  isConfigured: Boolean(process.env.DATABASE_URL),
};

export async function getPrismaClient() {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  try {
    const prismaModule: any = await import('@prisma/client');
    const ClientClass = prismaModule.PrismaClient || prismaModule.default?.PrismaClient;
    if (ClientClass) {
      return new ClientClass();
    }
    return null;
  } catch {
    console.warn('Prisma client not yet generated. Run `npx prisma generate` after configuring DATABASE_URL.');
    return null;
  }
}
