"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import WalletButton from "./wallet-button"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Function to determine if link is active
  const isActiveLink = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-800 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold">
            <span className="text-white">Learn</span>
            <span className="text-[#8A6FE8]">EX</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors ${
              isActiveLink('/') 
                ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/marketplace" 
            className={`text-sm font-medium transition-colors ${
              isActiveLink('/marketplace') 
                ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            Marketplace
          </Link>
          <Link 
            href="/web-thumbnails" 
            className={`text-sm font-medium transition-colors ${
              isActiveLink('/web-thumbnails') || isActiveLink('/marketplace/web-thumbnails')
                ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            8-bit Thumbnails
          </Link>
          <Link 
            href="/upload" 
            className={`text-sm font-medium transition-colors ${
              isActiveLink('/upload') 
                ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            Upload
          </Link>
          <Link 
            href="/my-materials" 
            className={`text-sm font-medium transition-colors ${
              isActiveLink('/my-materials') 
                ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            My Materials
          </Link>
          <WalletButton />
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="container mx-auto px-4 pb-4 md:hidden">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActiveLink('/') 
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                  : 'text-white/80 hover:bg-slate-800 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/marketplace"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActiveLink('/marketplace') 
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                  : 'text-white/80 hover:bg-slate-800 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/web-thumbnails"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActiveLink('/web-thumbnails') || isActiveLink('/marketplace/web-thumbnails')
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                  : 'text-white/80 hover:bg-slate-800 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              8-bit Thumbnails
            </Link>
            <Link
              href="/upload"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActiveLink('/upload') 
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                  : 'text-white/80 hover:bg-slate-800 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Upload
            </Link>
            <Link
              href="/my-materials"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActiveLink('/my-materials') 
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                  : 'text-white/80 hover:bg-slate-800 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              My Materials
            </Link>
            <WalletButton isMobile />
          </div>
        </div>
      )}
    </nav>
  )
}

