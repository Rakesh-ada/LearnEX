"use client"

import { useState, useEffect } from "react"
import { Star, Loader2, RefreshCw } from "lucide-react"
import Image from "next/image"
import { getIPFSGatewayUrl, isValidIPFSCid } from "@/lib/pinning-service"
import { useLazyWebThumbnail } from "@/hooks/use-web-thumbnail"
import { generatePixelThumbnail } from "@/lib/pixel-thumbnail-generator"

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
      return 'from-purple-600 via-violet-500 to-blue-500' // Default gradient
  }
}

export default function WebNFTCard({ item, onClick }: NFTCardProps) {
  const [thumbnailError, setThumbnailError] = useState(false)
  const [fallbackThumbnail, setFallbackThumbnail] = useState("")
  const hasThumbnail = item.thumbnailHash && isValidIPFSCid(item.thumbnailHash)
  const thumbnailUrl = hasThumbnail ? getIPFSGatewayUrl(item.thumbnailHash!) : ""
  
  // Create a fallback thumbnail
  useEffect(() => {
    setFallbackThumbnail(generatePixelThumbnail(item.title, item.category))
  }, [item.title, item.category])
  
  // Use the lazy web thumbnail generator
  const {
    thumbnailUrl: webThumbnailUrl,
    isLoading,
    error,
    generateThumbnail
  } = useLazyWebThumbnail()
  
  // Generate the thumbnail when component mounts
  useEffect(() => {
    if (!hasThumbnail || thumbnailError) {
      generateThumbnail(item.title, item.category).catch(() => {
        // Silently handle the error as we'll show the fallback thumbnail
      })
    }
  }, [item.title, item.category, hasThumbnail, thumbnailError, generateThumbnail])
  
  // Get the actual thumbnail to display
  const displayThumbnail = hasThumbnail && !thumbnailError 
    ? thumbnailUrl 
    : webThumbnailUrl || fallbackThumbnail
  
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
          backgroundImage: "url('/backgrounds/blockchain-pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      <div className="relative z-10">
        {/* Image container with improved shadows */}
        <div className="relative mb-5 aspect-square overflow-hidden rounded-lg ring-1 ring-white/10">
          {hasThumbnail && !thumbnailError ? (
            <>
              <Image
                src={thumbnailUrl}
                alt={item.title}
                width={300}
                height={300}
                className="h-full w-full object-cover"
                onError={() => setThumbnailError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
            </>
          ) : (
            <>
              {/* Web-based or 8-bit Pixel Art Thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-[2px]">
                <div className="flex h-full items-center justify-center">
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-white/70" />
                      <p className="mt-2 text-xs text-white/50">Generating thumbnail...</p>
                    </div>
                  ) : error && !webThumbnailUrl && !fallbackThumbnail ? (
                    <div className="text-center px-4">
                      <p className="text-red-400 text-sm">Thumbnail generation failed</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          generateThumbnail(item.title, item.category);
                        }}
                        className="mt-2 text-xs bg-slate-800 text-white/70 px-3 py-1 rounded-md"
                      >
                        <RefreshCw className="h-3 w-3 inline mr-1" />
                        Retry
                      </button>
                    </div>
                  ) : displayThumbnail ? (
                    <div className="relative h-4/5 w-4/5 overflow-hidden rounded-md border border-white/10">
                      <Image
                        src={displayThumbnail}
                        alt={item.title}
                        width={300}
                        height={300}
                        className="h-full w-full"
                      />
                    </div>
                  ) : (
                    <div 
                      className="flex items-center justify-center h-4/5 w-4/5 border border-dashed border-white/20 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        generateThumbnail(item.title, item.category);
                      }}
                    >
                      <p className="text-white/50 text-xs text-center">Click to generate<br/>web thumbnail</p>
                    </div>
                  )}
                </div>
              </div>
              {displayThumbnail && (
                <div className="absolute bottom-1 right-1 z-20 rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] text-white/70">
                  {hasThumbnail ? "ipfs" : "web-8-bit"}
                </div>
              )}
            </>
          )}
          {/* Category badge with improved styling */}
          <div className="absolute bottom-3 left-3 z-10 rounded-md bg-black/80 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
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