"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

interface NFTCardProps {
  item: {
    id: string
    title: string
    description: string
    price: string
    author: string
    category: string
    image?: string
    thumbnailHash?: string
    rating?: number
    sales?: number
  }
  onClick: () => void
}

// Function to get gradient based on subject category
function getSubjectGradient(subject: string): string {
  switch (subject?.toLowerCase()) {
    case 'mathematics':
      return 'from-blue-600 via-indigo-500 to-purple-500'
    case 'chemistry':
      return 'from-green-500 via-teal-500 to-cyan-500'
    case 'physics':
      return 'from-purple-600 via-indigo-500 to-blue-500'
    case 'biology':
      return 'from-green-600 via-emerald-500 to-teal-500'
    case 'computer science':
    case 'computer-science':
      return 'from-blue-600 via-indigo-500 to-violet-500'
    case 'literature':
      return 'from-amber-500 via-orange-500 to-red-500'
    case 'history':
      return 'from-red-600 via-rose-500 to-pink-500'
    case 'economics':
      return 'from-emerald-600 via-green-500 to-teal-500'
    case 'blockchain':
      return 'from-purple-600 via-violet-500 to-blue-500'
    case 'programming':
      return 'from-blue-500 via-cyan-500 to-teal-500'
    case 'design':
      return 'from-pink-500 via-purple-500 to-indigo-500'
    case 'business':
      return 'from-blue-500 via-indigo-500 to-purple-500'
    case 'science':
      return 'from-cyan-500 via-blue-500 to-indigo-500'
    case 'language':
      return 'from-yellow-500 via-orange-500 to-red-500'
    default:
      return 'from-purple-600 via-violet-500 to-blue-500' // Default gradient like in the image
  }
}

export default function NFTCard({ item, onClick }: NFTCardProps) {
  return (
    <div
      className={`group relative h-full cursor-pointer overflow-hidden rounded-xl border border-slate-800/50 bg-gradient-to-br ${getSubjectGradient(
        item.category
      )} p-5 backdrop-blur-sm transition-all duration-300 hover:border-slate-700 hover:shadow-lg hover:shadow-purple-500/10`}
      onClick={onClick}
    >
      {/* Blockchain pattern overlay with improved opacity */}
      <div 
        className="absolute inset-0 opacity-10 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-20"
        style={{
          backgroundImage: "url('/backgrounds/blockchain-pattern.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      <div className="relative z-10">
        {/* Image container with improved shadows */}
        <div className="relative mb-5 aspect-square overflow-hidden rounded-lg ring-1 ring-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-[2px]">
            {/* Category-based icon/background */}
            <div className="flex h-full items-center justify-center">
              {item.category === "Mathematics" && (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-blue-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  <div className="mt-2 text-sm font-medium text-blue-400">Mathematics</div>
                </div>
              )}
              {item.category === "Chemistry" && (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-green-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 3h6v11l3 3H6l3-3V3z"></path>
                    <path d="M10 9h4"></path>
                  </svg>
                  <div className="mt-2 text-sm font-medium text-green-400">Chemistry</div>
                </div>
              )}
              {item.category === "Physics" && (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-indigo-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M18.4 12a6.8 6.8 0 0 0 0-6.8M5.6 12a6.8 6.8 0 0 1 0-6.8"></path>
                    <path d="M18.4 12a6.8 6.8 0 0 1-12.8 0"></path>
                  </svg>
                  <div className="mt-2 text-sm font-medium text-indigo-400">Physics</div>
                </div>
              )}
              {item.category === "Biology" && (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-emerald-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <path d="M8 7V3m8 4V3"></path>
                  </svg>
                  <div className="mt-2 text-sm font-medium text-emerald-400">Biology</div>
                </div>
              )}
              {item.category === "Computer Science" && (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-cyan-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m9 10 2 2-2 2"></path>
                    <path d="M15 10h-4"></path>
                  </svg>
                  <div className="mt-2 text-sm font-medium text-cyan-400">Computer Science</div>
                </div>
              )}
              {item.category === "Literature" && (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-amber-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                  </svg>
                  <div className="mt-2 text-sm font-medium text-amber-400">Literature</div>
                </div>
              )}
              {item.category === "History" && (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-orange-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <div className="mt-2 text-sm font-medium text-orange-400">History</div>
                </div>
              )}
              {item.category === "Economics" && (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-lime-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="2" x2="12" y2="22"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  <div className="mt-2 text-sm font-medium text-lime-400">Economics</div>
                </div>
              )}
              {item.category?.toLowerCase() === "blockchain" && (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-purple-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="6" height="6" rx="1"></rect>
                    <rect x="16" y="7" width="6" height="6" rx="1"></rect>
                    <rect x="9" y="7" width="6" height="6" rx="1"></rect>
                    <rect x="9" y="16" width="6" height="6" rx="1"></rect>
                    <path d="M5 13v2"></path>
                    <path d="M19 13v2"></path>
                    <path d="M12 13v2"></path>
                  </svg>
                  <div className="mt-2 text-sm font-medium text-purple-400">Blockchain</div>
                </div>
              )}
              {!["mathematics", "chemistry", "physics", "biology", 
                "computer science", "computer-science", "literature", "history", 
                "economics", "blockchain", "programming", "design", "business",
                "science", "language"].includes(item.category?.toLowerCase()) && (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-purple-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  <div className="mt-2 text-sm font-medium text-purple-400">{item.category}</div>
                </div>
              )}
            </div>
          </div>
          {/* Category badge with improved styling */}
          <div className="absolute bottom-3 left-3 rounded-md bg-black/80 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
            {item.category}
          </div>
        </div>

        {/* Content section with improved spacing and typography */}
        <h3 className="mb-2 text-lg font-bold leading-tight text-white/90 transition-colors duration-200 group-hover:text-white">
          {item.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-300/80 transition-colors duration-200 group-hover:text-slate-300">
          {item.description}
        </p>

        {/* Rating section with improved alignment */}
        {typeof item.rating === 'number' && (
          <div className="mb-4 flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <Star className="h-4 w-4 fill-yellow-400/90 text-yellow-400" />
              <span className="text-sm font-medium text-white/90">{item.rating.toFixed(1)}</span>
            </div>
            {typeof item.sales === 'number' && (
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500">•</span>
                <span className="text-sm text-slate-400/90">{item.sales} sales</span>
              </div>
            )}
          </div>
        )}

        {/* Price and Author with improved layout */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-white/90 transition-colors duration-200 group-hover:text-white">
            {item.price}
          </div>
          <div className="truncate text-xs text-slate-400/90 transition-colors duration-200 group-hover:text-slate-400">
            by {item.author.substring(0, 6)}...
          </div>
        </div>
      </div>
    </div>
  )
}
