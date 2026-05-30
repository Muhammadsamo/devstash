# DevStash — Project Overview

> **One fast, searchable, AI-enhanced hub for all your dev knowledge & resources.**

---

## Table of Contents

1. [The Problem](#the-problem)
2. [Target Users](#target-users)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Data Models (Draft)](#data-models-draft)
6. [Architecture Diagram](#architecture-diagram)
7. [UI/UX Guidelines](#uiux-guidelines)
8. [Design](#design)
9. [Item Types Reference](#item-types-reference)
10. [Monetization](#monetization)
11. [Key Libraries & Links](#key-libraries--links)

---

## The Problem

Developers scatter their essential resources across too many places:

| What | Where It Lives |
|---|---|
| Code snippets | VS Code, Notion, Gists |
| AI prompts | Chat histories |
| Context files | Buried in project folders |
| Useful links | Browser bookmarks |
| Documentation | Random folders |
| Terminal commands | `.txt` files, bash history |

This causes context switching, lost knowledge, and inconsistent workflows. **DevStash consolidates everything into one hub.**

---

## Target Users

| User | Primary Need |
|---|---|
| **Everyday Developer** | Fast access to snippets, prompts, commands, links |
| **AI-First Developer** | Save prompts, contexts, workflows, system messages |
| **Content Creator / Educator** | Store code blocks, explanations, course notes |
| **Full-Stack Builder** | Collect patterns, boilerplates, API examples |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/docs) / [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [Neon](https://neon.tech/docs) (PostgreSQL) |
| **ORM** | [Prisma 7](https://www.prisma.io/docs) |
| **Auth** | [NextAuth v5](https://authjs.dev/) (Email/password + GitHub OAuth) |
| **File Storage** | [Cloudflare R2](https://developers.cloudflare.com/r2/) |
| **AI** | [OpenAI](https://platform.openai.com/docs) — `gpt-4o-mini` model |
| **CSS** | [Tailwind CSS v4](https://tailwindcss.com/docs) + [shadcn/ui](https://ui.shadcn.com/) |
| **Caching** | Redis *(optional, TBD)* |
| **Payments** | [Stripe](https://stripe.com/docs) |

> ⚠️ **Database rule:** Never use `db push` or modify the schema directly. Always create migrations that run in both dev and prod.

---

## Features

### A. Items & Item Types

Items are the core unit of DevStash. Each item has a **type** which controls its icon, color, and behavior.

**Content categories:**

| Category | Types |
|---|---|
| `text` | `snippet`, `prompt`, `note`, `command` |
| `url` | `link` |
| `file` | `file` *(Pro)*, `image` *(Pro)* |

- System types are built-in and cannot be modified.
- Custom types are a planned Pro feature (future release).
- Items are accessible via `/items/snippets`, `/items/prompts`, etc.
- Items can be created/accessed quickly via a **slide-in drawer**.

---

### B. Collections

Collections group items of any type. An item can belong to **multiple collections**.

**Examples:**

- `React Patterns` → snippets, notes
- `Context Files` → files
- `Python Snippets` → snippets
- `Interview Prep` → snippets, notes, links

---

### C. Search

Full-text search across:

- Content
- Tags
- Titles
- Item types

---

### D. Authentication

- Email & password
- GitHub OAuth
- Powered by NextAuth v5

---

### E. Core Features

- ⭐ Favorite collections and items
- 📌 Pin items to top
- 🕐 Recently used items
- 📥 Import code from a file
- ✍️ Markdown editor for text-based types
- 📁 File upload for `file` and `image` types
- 📤 Export data as different formats
- 🌑 Dark mode (default)
- 🔗 Add/remove items to/from multiple collections
- 📋 View which collections an item belongs to

---

### F. AI Features *(Pro only)*

- 🏷️ Auto-tag suggestions
- 📝 AI summaries
- 🧠 Explain This Code
- ✨ Prompt optimizer

---

## Data Models (Draft)

> ⚠️ **Rough draft** — subject to change. These are starting-point Prisma models based on current planning. Field names, types, and relations will evolve as development begins.

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ──────────────────────────────────────────────
// AUTH (extends NextAuth schema)
// ──────────────────────────────────────────────

model User {
  id                   String    @id @default(cuid())
  name                 String?
  email                String    @unique
  emailVerified        DateTime?
  image                String?
  password             String?   // hashed, null for OAuth users
  isPro                Boolean   @default(false)
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?   @unique
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  accounts    Account[]
  sessions    Session[]
  items       Item[]
  collections Collection[]
  itemTypes   ItemType[]    // user-created custom types

  @@map("users")
}

// Standard NextAuth models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ──────────────────────────────────────────────
// ITEM TYPES
// ──────────────────────────────────────────────

enum ContentType {
  TEXT
  URL
  FILE
}

model ItemType {
  id       String          @id @default(cuid())
  name     String          // e.g. "snippet", "prompt"
  slug     String          @unique // e.g. "snippets" — used in URLs
  icon     String          // Lucide icon name
  color    String          // hex color
  category ContentType
  isSystem Boolean         @default(false) // system types cannot be edited/deleted

  // null for system types; set for user-created custom types
  userId String?
  user   User?   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items Item[]

  @@map("item_types")
}

// ──────────────────────────────────────────────
// ITEMS
// ──────────────────────────────────────────────

model Item {
  id          String   @id @default(cuid())
  title       String
  description String?

  // Content — one of the following will be populated depending on type category
  content     String?  // text/markdown content
  url         String?  // for link types
  fileUrl     String?  // Cloudflare R2 URL for file/image types
  fileName    String?  // original filename
  fileSize    Int?     // bytes

  // Code metadata
  language    String?  // e.g. "typescript", "python" — for syntax highlighting

  // Status flags
  isFavorite  Boolean  @default(false)
  isPinned    Boolean  @default(false)
  lastUsedAt  DateTime?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  itemTypeId  String
  itemType    ItemType @relation(fields: [itemTypeId], references: [id])

  tags        ItemTag[]
  collections ItemCollection[]

  @@map("items")
}

// ──────────────────────────────────────────────
// TAGS
// ──────────────────────────────────────────────

model Tag {
  id    String    @id @default(cuid())
  name  String    @unique

  items ItemTag[]

  @@map("tags")
}

model ItemTag {
  itemId String
  tagId  String

  item Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
  @@map("item_tags")
}

// ──────────────────────────────────────────────
// COLLECTIONS
// ──────────────────────────────────────────────

model Collection {
  id            String   @id @default(cuid())
  name          String
  description   String?
  isFavorite    Boolean  @default(false)

  // Hint for UI color — derived from the dominant item type in the collection
  defaultTypeId String?

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  items         ItemCollection[]

  @@map("collections")
}

// ──────────────────────────────────────────────
// JOIN TABLE — Items ↔ Collections
// ──────────────────────────────────────────────

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
  @@map("item_collections")
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Next.js 16 App                     │
│                                                       │
│  ┌──────────────┐         ┌──────────────────────┐   │
│  │  Pages / UI  │         │    API Routes         │   │
│  │  (React 19)  │◄───────►│  /api/items           │   │
│  │  Tailwind v4 │         │  /api/collections     │   │
│  │  shadcn/ui   │         │  /api/auth            │   │
│  └──────────────┘         │  /api/ai              │   │
│                            │  /api/upload          │   │
│                            └────────┬─────────────┘   │
└─────────────────────────────────────┼─────────────────┘
                                      │
            ┌─────────────────────────┼──────────────────┐
            │                         │                   │
            ▼                         ▼                   ▼
   ┌────────────────┐      ┌─────────────────┐  ┌───────────────┐
   │ Neon PostgreSQL│      │  Cloudflare R2  │  │  OpenAI API   │
   │ via Prisma 7   │      │  (file/image    │  │  gpt-4o-mini  │
   │                │      │   uploads)      │  │  AI features  │
   └────────────────┘      └─────────────────┘  └───────────────┘
            │
            ▼
   ┌────────────────┐      ┌─────────────────┐
   │  NextAuth v5   │      │  Stripe         │
   │  Email + GitHub│      │  (Pro billing)  │
   └────────────────┘      └─────────────────┘
```

---

## UI/UX Guidelines

### General Aesthetic

- Modern, minimal, developer-focused
- **Dark mode default**, light mode optional
- Clean typography, generous whitespace
- Subtle borders and shadows
- Inspiration: [Notion](https://notion.so), [Linear](https://linear.app), [Raycast](https://raycast.com)
- Syntax highlighting for code blocks (e.g. [Shiki](https://shiki.style/) or [highlight.js](https://highlightjs.org/))

### Layout

```
┌────────────────────────────────────────────────────┐
│ Sidebar (collapsible)  │  Main Content             │
│                        │                           │
│  Item Types            │  Collections Grid         │
│  ├── Snippets          │  ┌──────┐ ┌──────┐        │
│  ├── Prompts           │  │ 🟦   │ │ 🟪   │        │
│  ├── Commands          │  │React │ │Prompt│        │
│  ├── Notes             │  │Patt. │ │Lib   │        │
│  ├── Links             │  └──────┘ └──────┘        │
│  └── Files             │                           │
│                        │  Items (color-coded cards)│
│  Collections           │  ┌──────────────────────┐ │
│  ├── React Patterns    │  │ [snippet] useCallback │ │
│  ├── Prompts           │  └──────────────────────┘ │
│  └── ...               │                           │
└────────────────────────────────────────────────────┘
```

- **Sidebar** → item type nav + recent collections; collapses on mobile into a drawer
- **Main area** → color-coded collection cards (background = dominant item type color), items below as color-coded cards (border = type color)
- **Item detail** → opens in a quick-access side drawer

### Micro-interactions

- Smooth transitions on hover and panel open/close
- Hover states on all cards
- Toast notifications for create/edit/delete actions
- Loading skeletons while data fetches

---

## Design

### Design Principles

These principles should guide every UI decision in DevStash — from component design to information architecture.

**1. Speed over ceremony**
Developers open DevStash to grab something and get back to work. Every interaction should be fast. No unnecessary modals, no multi-step flows for simple actions. The drawer, keyboard shortcuts, and quick-create all exist for this reason.

**2. Density with breathing room**
Dev tools should be information-dense, but not claustrophobic. Show more at once than a consumer app would, but use whitespace deliberately to group related elements and reduce visual noise.

**3. Keyboard-first, mouse-friendly**
Power users will navigate entirely from the keyboard. Every key action (open drawer, search, copy snippet, switch type) should have a shortcut. Mouse interactions should feel polished but shouldn't be the only path.

**4. Dark by default, not as an afterthought**
Dark mode is the primary experience. Colors, shadows, borders, and contrast ratios are all designed dark-first. Light mode is a supported variant, not a toggle that inverts dark styles.

**5. Color carries meaning**
Each item type has an assigned color. That color is used consistently — on cards, badges, sidebar indicators, and collection backgrounds. Users should be able to visually identify type at a glance without reading the label.

**6. Progressive disclosure**
Show the essentials first. Details (description, tags, collection membership, timestamps) live in the item drawer, not on the card. Don't overload the grid view.

**7. Trustworthy feedback**
Every action should have a clear, immediate response — a toast, a spinner, an optimistic UI update. Users should never wonder if something worked.

---

### Design References

These products represent different aspects of what DevStash should feel and behave like. Study them for specific patterns, not wholesale copying.

| Product | What to borrow | Link |
|---|---|---|
| **Linear** | Keyboard-first UX, dense but clean sidebar, command palette, subtle animations, badge/status color system | [linear.app](https://linear.app) |
| **Notion** | Content editing experience, block-level interactions, clean typography hierarchy, slash commands | [notion.so](https://notion.so) |
| **Raycast** | Speed-first philosophy, minimal chrome, powerful search UX, developer focus | [raycast.com](https://raycast.com) |
| **GitHub** | Code presentation, syntax highlighting, monospace use, file/blob views | [github.com](https://github.com) |
| **Vercel Dashboard** | Clean dark UI, card grids, deployment/status indicators, muted color palette | [vercel.com](https://vercel.com) |
| **Supabase Dashboard** | Sidebar navigation, data table design, developer-first aesthetic | [supabase.com](https://supabase.com) |
| **Zed Editor** | Tight information density, dark theme color use, monospace typography | [zed.dev](https://zed.dev) |

---

### Screenshots

Refer to the screenshots below as a base for the dashboard UI. It does not have to be exact. Use it as a reference:

- @context/screenshots/dashboard-ui-main.png
- @context/screenshots/dashboard-ui-drawer.png`

### Typography

| Role | Font | Notes |
|---|---|---|
| UI / Body | `Inter` | Clean, readable sans-serif; works well at small sizes |
| Code / Monospace | `JetBrains Mono` or `Fira Code` | Ligature support; consistent with dev tooling expectations |

- Font sizes: follow Tailwind's scale (`text-sm` / `text-base` / `text-lg` for UI; `text-xs` / `text-sm` for metadata)
- Line height: generous (`leading-relaxed`) for prose; tighter for dense UI elements

---

### Color Palette

#### Base (Dark Mode)

| Role | Token | Example Hex |
|---|---|---|
| Background | `bg-zinc-950` | `#09090b` |
| Surface (cards, sidebar) | `bg-zinc-900` | `#18181b` |
| Border | `border-zinc-800` | `#27272a` |
| Muted text | `text-zinc-400` | `#a1a1aa` |
| Body text | `text-zinc-100` | `#f4f4f5` |
| Primary accent | `text-blue-500` | `#3b82f6` |

#### Item Type Colors

These are used for card borders, sidebar indicators, and collection card backgrounds (at reduced opacity).

| Type | Hex | Tailwind approx. |
|---|---|---|
| Snippet | `#3b82f6` | `blue-500` |
| Prompt | `#8b5cf6` | `violet-500` |
| Command | `#f97316` | `orange-500` |
| Note | `#fde047` | `yellow-300` |
| File | `#6b7280` | `gray-500` |
| Image | `#ec4899` | `pink-500` |
| Link | `#10b981` | `emerald-500` |

---

### Spacing & Sizing

- Base unit: `4px` (Tailwind default)
- Card padding: `p-4` (16px)
- Sidebar width: `240px` collapsed to icon rail at `56px`
- Drawer width: `480px` on desktop, full-width on mobile
- Grid columns: 3–4 on desktop, 2 on tablet, 1 on mobile

---

### Component Guidelines

**Cards**
- Rounded corners: `rounded-lg`
- Subtle border: `border border-zinc-800`
- Left accent border in item type color (4px): `border-l-4`
- Hover: slight background lift (`hover:bg-zinc-800/60`) + shadow

**Drawer (Item Detail)**
- Slides in from the right
- Contains: title, type badge, full content with syntax highlighting, tags, collection membership, timestamps, action buttons (copy, edit, delete, favorite, pin)
- Close on `Esc` or click outside

**Sidebar**
- Section headers: `text-xs uppercase tracking-widest text-zinc-500`
- Active item: left border accent + slightly lighter background
- Collapsible: icons only in collapsed rail mode

**Badges / Type Pills**
- `text-xs font-medium rounded-full px-2 py-0.5`
- Background: type color at 15% opacity; text: type color

---

## Item Types Reference

| Type | Icon | Color | Hex | URL |
|---|---|---|---|---|
| Snippet | `Code` | Blue | `#3b82f6` | `/items/snippets` |
| Prompt | `Sparkles` | Purple | `#8b5cf6` | `/items/prompts` |
| Command | `Terminal` | Orange | `#f97316` | `/items/commands` |
| Note | `StickyNote` | Yellow | `#fde047` | `/items/notes` |
| File *(Pro)* | `File` | Gray | `#6b7280` | `/items/files` |
| Image *(Pro)* | `Image` | Pink | `#ec4899` | `/items/images` |
| Link | `Link` | Emerald | `#10b981` | `/items/links` |

> Icons are from [Lucide React](https://lucide.dev/icons/).

---

## Monetization

### Free Tier

- 50 items total
- 3 collections
- All system types **except** `file` and `image`
- Basic search
- No file/image uploads
- No AI features

### Pro — $8/month or $72/year

- Unlimited items
- Unlimited collections
- File & image uploads
- Custom item types *(future release)*
- AI auto-tagging
- AI code explanation
- AI prompt optimizer
- Export data (JSON / ZIP)
- Priority support

> 🚧 **During development:** All users have full Pro access. Gating will be enforced before launch.

---

## Key Libraries & Links

### Core

- [Next.js Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

### Database & Auth

- [Prisma 7 Docs](https://www.prisma.io/docs)
- [Neon Docs](https://neon.tech/docs)
- [NextAuth v5 (Auth.js)](https://authjs.dev/)

### Storage & Payments

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Stripe Docs](https://stripe.com/docs)

### UI

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide React Icons](https://lucide.dev/icons/)
- [Shiki (syntax highlighting)](https://shiki.style/)

### AI

- [OpenAI API Docs](https://platform.openai.com/docs)

---
