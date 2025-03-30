"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { href: "/web-thumbnails", label: "Demo" },
  { href: "/marketplace/web-thumbnails", label: "Marketplace" },
]

export function WebThumbnailsNav() {
  const pathname = usePathname()

  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex items-center rounded-lg bg-slate-900/50 p-1.5 backdrop-blur">
        {links.map((link) => {
          const isActive = pathname === link.href
          
          return (
            <Link
              href={link.href}
              key={link.href}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-purple-700 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
} 