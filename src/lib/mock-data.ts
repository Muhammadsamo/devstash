export interface MockUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  isPro: boolean;
}

export interface MockItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
}

export interface MockTag {
  id: string;
  name: string;
}

export interface MockCollection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
}

export interface MockItem {
  id: string;
  title: string;
  contentType: "text" | "file";
  content: string | null;
  description: string | null;
  language: string | null;
  url: string | null;
  fileName: string | null;
  fileSize: number | null;
  isFavorite: boolean;
  isPinned: boolean;
  typeId: string;
  collectionId: string | null;
  tags: MockTag[];
  createdAt: string;
  updatedAt: string;
}

export const currentUser: MockUser = {
  id: "user_1",
  email: "alex@devstash.io",
  name: "Alex Chen",
  image: null,
  isPro: true,
};

export const itemTypes: MockItemType[] = [
  { id: "type_1", name: "Snippet", icon: "Code", color: "#22c55e", isSystem: true },
  { id: "type_2", name: "Prompt", icon: "MessageSquare", color: "#a78bfa", isSystem: true },
  { id: "type_3", name: "Note", icon: "FileText", color: "#f59e0b", isSystem: true },
  { id: "type_4", name: "Command", icon: "Terminal", color: "#3b82f6", isSystem: true },
  { id: "type_5", name: "File", icon: "Paperclip", color: "#ec4899", isSystem: true },
  { id: "type_6", name: "Image", icon: "Image", color: "#14b8a6", isSystem: true },
  { id: "type_7", name: "URL", icon: "Link", color: "#f97316", isSystem: true },
];

export const tags: MockTag[] = [
  { id: "tag_1", name: "react" },
  { id: "tag_2", name: "python" },
  { id: "tag_3", name: "nextjs" },
  { id: "tag_4", name: "tailwind" },
  { id: "tag_5", name: "docker" },
  { id: "tag_6", name: "typescript" },
  { id: "tag_7", name: "database" },
  { id: "tag_8", name: "testing" },
];

export const collections: MockCollection[] = [
  { id: "col_1", name: "React Patterns", description: "Common React patterns and hooks", isFavorite: true, itemCount: 4 },
  { id: "col_2", name: "Docker Commands", description: "Useful Docker and Compose commands", isFavorite: false, itemCount: 2 },
  { id: "col_3", name: "AI Prompts", description: "Prompts for coding assistants", isFavorite: true, itemCount: 3 },
];

export const items: MockItem[] = [
  {
    id: "item_1",
    title: "useDebounce hook",
    contentType: "text",
    content: "export function useDebounce<T>(value: T, delay: number): T {\n  const [debounced, setDebounced] = useState(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n\n  return debounced;\n}",
    description: "A custom React hook that debounces a value",
    language: "typescript",
    url: null,
    fileName: null,
    fileSize: null,
    isFavorite: true,
    isPinned: true,
    typeId: "type_1",
    collectionId: "col_1",
    tags: [tags[0], tags[5]],
    createdAt: "2026-05-28T10:00:00Z",
    updatedAt: "2026-05-29T14:00:00Z",
  },
  {
    id: "item_2",
    title: "API route with Prisma",
    contentType: "text",
    content: "export async function GET(req: Request) {\n  const items = await prisma.item.findMany({\n    where: { userId: session.user.id },\n    include: { tags: true, type: true },\n  });\n  return Response.json(items);\n}",
    description: "Next.js API route pattern with Prisma queries",
    language: "typescript",
    url: null,
    fileName: null,
    fileSize: null,
    isFavorite: false,
    isPinned: false,
    typeId: "type_1",
    collectionId: "col_1",
    tags: [tags[2], tags[5]],
    createdAt: "2026-05-27T09:00:00Z",
    updatedAt: "2026-05-27T09:00:00Z",
  },
  {
    id: "item_3",
    title: "Explain this Prisma query",
    contentType: "text",
    content: "You are an expert Prisma and PostgreSQL tutor. Explain the following query in simple terms, breaking down what each part does:\n\nprisma.user.findMany({\n  where: { isPro: true },\n  include: { items: { take: 5 } },\n  orderBy: { createdAt: \"desc\" },\n});",
    description: "Prompt template for explaining database queries with AI",
    language: null,
    url: null,
    fileName: null,
    fileSize: null,
    isFavorite: true,
    isPinned: false,
    typeId: "type_2",
    collectionId: "col_3",
    tags: [tags[6]],
    createdAt: "2026-05-26T16:00:00Z",
    updatedAt: "2026-05-26T16:00:00Z",
  },
  {
    id: "item_4",
    title: "Docker Compose for Postgres",
    contentType: "text",
    content: "services:\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_DB: devstash\n      POSTGRES_PASSWORD: ${DB_PASSWORD}\n    ports:\n      - \"5432:5432\"\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n\nvolumes:\n  pgdata:",
    description: "Local Postgres setup with Docker Compose",
    language: "yaml",
    url: null,
    fileName: null,
    fileSize: null,
    isFavorite: false,
    isPinned: false,
    typeId: "type_4",
    collectionId: "col_2",
    tags: [tags[4], tags[6]],
    createdAt: "2026-05-25T11:00:00Z",
    updatedAt: "2026-05-25T11:00:00Z",
  },
  {
    id: "item_5",
    title: "Project architecture notes",
    contentType: "text",
    content: "# Architecture Decisions\n\n- App Router for routing\n- Server components by default\n- Prisma for data access\n- Cloudflare R2 for file uploads\n- NextAuth v5 for auth\n\n## Folder Structure\n\nsrc/\n  app/       - routes\n  components - shared UI\n  lib/       - utilities\n  actions/   - server actions",
    description: "Early architecture notes for DevStash",
    language: "markdown",
    url: null,
    fileName: null,
    fileSize: null,
    isFavorite: false,
    isPinned: false,
    typeId: "type_3",
    collectionId: null,
    tags: [tags[2]],
    createdAt: "2026-05-24T08:00:00Z",
    updatedAt: "2026-05-24T08:00:00Z",
  },
  {
    id: "item_6",
    title: "Tailwind v4 breakpoints",
    contentType: "text",
    content: "/* Custom breakpoints for the dashboard */\n@theme {\n  --breakpoint-xs: 480px;\n  --breakpoint-3xl: 1920px;\n}",
    description: "Custom Tailwind v4 breakpoint overrides",
    language: "css",
    url: null,
    fileName: null,
    fileSize: null,
    isFavorite: false,
    isPinned: false,
    typeId: "type_1",
    collectionId: null,
    tags: [tags[3]],
    createdAt: "2026-05-23T15:00:00Z",
    updatedAt: "2026-05-23T15:00:00Z",
  },
  {
    id: "item_7",
    title: "Build a REST API with Next.js",
    contentType: "text",
    content: "Build a full-featured REST API using Next.js App Router route handlers. Cover CRUD operations, error handling, middleware, and rate limiting.",
    description: "Blog post idea for Next.js API routes",
    language: null,
    url: null,
    fileName: null,
    fileSize: null,
    isFavorite: false,
    isPinned: false,
    typeId: "type_3",
    collectionId: null,
    tags: [tags[2], tags[5]],
    createdAt: "2026-05-22T12:00:00Z",
    updatedAt: "2026-05-22T12:00:00Z",
  },
  {
    id: "item_8",
    title: "Generate test data script",
    contentType: "text",
    content: "Write a Python script that connects to our Postgres database via psycopg2 and inserts 100 sample items across different types for testing the dashboard UI.",
    description: "Prompt to generate a test data seeding script",
    language: null,
    url: null,
    fileName: null,
    fileSize: null,
    isFavorite: false,
    isPinned: false,
    typeId: "type_2",
    collectionId: "col_3",
    tags: [tags[1], tags[7]],
    createdAt: "2026-05-21T10:00:00Z",
    updatedAt: "2026-05-21T10:00:00Z",
  },
  {
    id: "item_9",
    title: "npx prisma migrate dev",
    contentType: "text",
    content: null,
    description: "Run Prisma migrations during development",
    language: null,
    url: null,
    fileName: null,
    fileSize: null,
    isFavorite: false,
    isPinned: false,
    typeId: "type_4",
    collectionId: null,
    tags: [tags[6]],
    createdAt: "2026-05-20T09:00:00Z",
    updatedAt: "2026-05-20T09:00:00Z",
  },
  {
    id: "item_10",
    title: "shadcn/ui docs",
    contentType: "text",
    content: null,
    description: "Official shadcn/ui documentation and component reference",
    language: null,
    url: "https://ui.shadcn.com/docs",
    fileName: null,
    fileSize: null,
    isFavorite: true,
    isPinned: false,
    typeId: "type_7",
    collectionId: null,
    tags: [tags[3], tags[0]],
    createdAt: "2026-05-19T14:00:00Z",
    updatedAt: "2026-05-19T14:00:00Z",
  },
  {
    id: "item_11",
    title: "logo-full.png",
    contentType: "file",
    content: null,
    description: "DevStash full logo with text",
    language: null,
    url: null,
    fileName: "logo-full.png",
    fileSize: 24576,
    isFavorite: false,
    isPinned: false,
    typeId: "type_6",
    collectionId: null,
    tags: [],
    createdAt: "2026-05-18T10:00:00Z",
    updatedAt: "2026-05-18T10:00:00Z",
  },
  {
    id: "item_12",
    title: "Dockerfile.prod",
    contentType: "file",
    content: null,
    description: "Production Dockerfile for Vercel deployment",
    language: null,
    url: null,
    fileName: "Dockerfile.prod",
    fileSize: 1024,
    isFavorite: false,
    isPinned: false,
    typeId: "type_5",
    collectionId: "col_2",
    tags: [tags[4]],
    createdAt: "2026-05-17T16:00:00Z",
    updatedAt: "2026-05-17T16:00:00Z",
  },
];
