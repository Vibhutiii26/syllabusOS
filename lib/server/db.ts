import 'server-only';
import { PrismaClient } from '@prisma/client';

// Prisma singleton (prevents hot-reload connection exhaustion in dev):
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'development') globalForPrisma.prisma = prisma;
