import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// HTTP adapter (stateless fetch over Neon's serverless driver). Required for
// Cloudflare Workers, where a module-scope WebSocket Pool connection cannot be
// reused across requests ("Cannot perform I/O on behalf of a different
// request"). Works on Node/Vercel too. Safe because the app uses no
// interactive transactions.
const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, {});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
