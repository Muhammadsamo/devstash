"use client"

import { Search, Plus, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TopBarProps {
  onMenuToggle: () => void
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuToggle}
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden md:flex items-center gap-2 font-semibold text-lg">
        DevStash
      </div>
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search anything..."
            className="pl-9"
          />
        </div>
      </div>
      <Button>
        <Plus className="h-4 w-4" />
        New Item
      </Button>
    </header>
  )
}
