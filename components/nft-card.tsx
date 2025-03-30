"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import Image from "next/image"
import { getIPFSGatewayUrl, isValidIPFSCid } from "@/lib/pinning-service"
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
      return 'from-purple-600 via-violet-500 to-blue-500' // Default gradient like in the image
  }
}

export default function NFTCard({ item, onClick }: NFTCardProps) {
  const [thumbnailError, setThumbnailError] = useState(false)
  const hasThumbnail = item.thumbnailHash && isValidIPFSCid(item.thumbnailHash)
  const thumbnailUrl = hasThumbnail ? getIPFSGatewayUrl(item.thumbnailHash!) : ""
  const pixelThumbnailUrl = generatePixelThumbnail(item.title, item.category)
  
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
              {/* 8-bit Pixel Art Thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-[2px]">
                <div className="flex h-full items-center justify-center">
                  <div className="relative h-4/5 w-4/5 overflow-hidden rounded-md border border-white/10">
                    <Image
                      src={pixelThumbnailUrl}
                      alt={item.title}
                      width={300}
                      height={300}
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-1 right-1 z-20 rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] text-white/70">8-bit</div>
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
