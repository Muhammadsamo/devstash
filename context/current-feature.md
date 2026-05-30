# Current Feature

> **Status**: 🟡 In Progress

## Current Feature Details

Create a seed script (`prisma/seed.ts`) to populate the database with sample data for development and demos.

### Requirements

#### User
- **Email:** demo@devstash.io
- **Name:** Demo User
- **Password:** 12345678 (hash with bcryptjs, 12 rounds)
- **isPro:** false
- **emailVerified:** current date

#### System Item Types
| Name    | Icon       | Color   |
| ------- | ---------- | ------- |
| snippet | Code       | #3b82f6 |
| prompt  | Sparkles   | #8b5cf6 |
| command | Terminal   | #f97316 |
| note    | StickyNote | #fde047 |
| file    | File       | #6b7280 |
| image   | Image      | #ec4899 |
| link    | Link       | #10b981 |

Icons are Lucide React component names. All types have `isSystem: true`.

#### Collections & Items
- **React Patterns**: 3 snippets (Custom hooks, Component patterns, Utility functions)
- **AI Workflows**: 3 prompts (Code review, Documentation generation, Refactoring assistance)
- **DevOps**: 1 snippet (Docker, CI/CD config), 1 command (deployment scripts), 2 links (documentation URLs)
- **Terminal Commands**: 4 commands (Git operations, Docker commands, Process management, Package manager utilities)
- **Design Resources**: 4 links (CSS/Tailwind references, Component libraries, Design systems, Icon libraries)

## History

| Feature | Branch | Status | Date |
|---------|--------|--------|------|
| Initial Next.js + Tailwind CSS v4 setup | `main` | ✅ Done | 2026-05-30 |
| Dashboard UI Layout — Phase 1 | `feature/dashboard-phase-1` | ✅ Done | 2026-05-30 |
| Dashboard UI Layout — Phase 2 | `feature/dashboard-phase-2` | ✅ Done | 2026-05-30 |
| Dashboard UI Layout — Phase 3 | `feature/dashboard-ui-phase-3` | ✅ Done | 2026-05-30 |
| Neon PostgreSQL + Prisma Setup | `feature/database-setup` | ✅ Done | 2026-05-30 |
