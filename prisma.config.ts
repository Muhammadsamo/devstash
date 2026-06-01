import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    // Migrations/CLI use a DIRECT (non-pooled) connection. Prisma's migration
    // engine takes a Postgres advisory lock, which does not work over Neon's
    // PgBouncer pooler (P1002 advisory-lock timeout). The app runtime still
    // connects via the pooled DATABASE_URL through the Neon driver adapter.
    url: env('DIRECT_URL'),
  },
})