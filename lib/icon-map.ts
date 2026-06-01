import {
  Code,
  MessageSquare,
  FileText,
  Terminal,
  Paperclip,
  Image,
  Link,
  Sparkles,
  StickyNote,
  File,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Code,
  MessageSquare,
  FileText,
  Terminal,
  Paperclip,
  Image,
  Link,
  Sparkles,
  StickyNote,
  File,
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? FileText
}
