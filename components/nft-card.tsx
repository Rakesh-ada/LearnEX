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
    case "mathematics":
      return "from-blue-600 via-indigo-500 to-purple-500"
    case "chemistry":
      return "from-green-500 via-teal-500 to-cyan-500"
    case "physics":
      return "from-purple-600 via-indigo-500 to-blue-500"
    case "biology":
      return "from-green-600 via-emerald-500 to-teal-500"
    case "computer science":
      return "from-blue-600 via-indigo-500 to-violet-500"
    case "literature":
      return "from-amber-500 via-orange-500 to-red-500"
    case "history":
      return "from-red-600 via-rose-500 to-pink-500"
    case "economics":
      return "from-emerald-600 via-green-500 to-teal-500"
    case "blockchain":
      return "from-purple-600 via-violet-500 to-blue-500"
    default:
      return "from-purple-600 via-violet-500 to-blue-500" // Default gradient
  }
}

export default function NFTCard({ item, onClick }: NFTCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={cardRef}
      className={`group relative h-full cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br ${getSubjectGradient(item.category)} p-4 backdrop-blur-sm transition-all duration-300`}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: "url('/backgrounds/blockchain-pattern.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        {/* Image or Placeholder */}
        <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-slate-900 flex items-center justify-center">
          {item.image ? (
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white/50">No Image</span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-white truncate">{item.title}</h3>
        <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>

        {/* Price & Author */}
        <div className="mt-2 flex items-center justify-between text-gray-400 text-sm">
          <span>{item.author}</span>
          <span className="font-bold text-white">${item.price}</span>
        </div>

        {/* Rating & Sales */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} fill={i < (item.rating || 0) ? "currentColor" : "none"} stroke="currentColor" className="w-4 h-4" />
            ))}
          </div>
          <span className="text-gray-400 text-sm">{item.sales} sales</span>
        </div>
      </div>
    </motion.div>
  )
}
