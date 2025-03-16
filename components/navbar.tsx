"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import WalletButton from "./wallet-button"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-800 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="relative mr-2 h-8 w-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-70 blur-sm"></div>
              <div className="absolute inset-0.5 rounded-full bg-black"></div>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">L</div>
            </div>
            <span className="text-xl font-bold text-white">LearnEX</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          <Link href="/" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
            Home
          </Link>
          <Link href="/marketplace" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
            Marketplace
          </Link>
          <Link href="/upload" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
            Upload
          </Link>
          <Link href="/my-materials" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
            My Materials
          </Link>
          <Link href="/thumbnails" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
            Thumbnails
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
              className="rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-slate-800 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/marketplace"
              className="rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-slate-800 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/upload"
              className="rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-slate-800 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Upload
            </Link>
            <Link
              href="/my-materials"
              className="rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-slate-800 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              My Materials
            </Link>
            <Link
              href="/thumbnails"
              className="rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-slate-800 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Thumbnails
            </Link>
            <WalletButton isMobile />
          </div>
        </div>
      )}
    </nav>
  )
}

