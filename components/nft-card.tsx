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
    image: string
    rating: number
    sales: number
  }
  onClick: () => void
}

export default function NFTCard({ item, onClick }: NFTCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 3D effect on hover
  useEffect(() => {
    if (!cardRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateY = ((x - centerX) / centerX) * 5
      const rotateX = ((centerY - y) / centerY) * 5

      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    const handleMouseLeave = () => {
      if (!cardRef.current) return
      cardRef.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0)"
    }

    if (isHovered) {
      cardRef.current.addEventListener("mousemove", handleMouseMove)
      cardRef.current.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener("mousemove", handleMouseMove)
        cardRef.current.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [isHovered])

  // Glowing neon effect
  useEffect(() => {
    if (!canvasRef.current || !isHovered) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    let animationFrameId: number

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, "rgba(147, 51, 234, 0.5)") // Purple
      gradient.addColorStop(1, "rgba(59, 130, 246, 0.5)") // Blue

      // Draw rounded rectangle with glow
      ctx.shadowBlur = 15
      ctx.shadowColor = "rgba(147, 51, 234, 0.7)"
      ctx.strokeStyle = gradient
      ctx.lineWidth = 2

      // Draw rounded rectangle
      const radius = 10
      ctx.beginPath()
      ctx.moveTo(radius, 0)
      ctx.lineTo(width - radius, 0)
      ctx.quadraticCurveTo(width, 0, width, radius)
      ctx.lineTo(width, height - radius)
      ctx.quadraticCurveTo(width, height, width - radius, height)
      ctx.lineTo(radius, height)
      ctx.quadraticCurveTo(0, height, 0, height - radius)
      ctx.lineTo(0, radius)
      ctx.quadraticCurveTo(0, 0, radius, 0)
      ctx.closePath()
      ctx.stroke()

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isHovered])

  return (
    <motion.div
      ref={cardRef}
      className="group relative h-full cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-sm transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glowing effect canvas */}
      <canvas
        ref={canvasRef}
        width="300"
        height="400"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Content with 3D effect */}
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        {/* Image with category-based thumbnail */}
        <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
            {/* Category-based icon/background */}
            <div className="flex h-full items-center justify-center">
              {item.category === "Mathematics" && (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-900/40 to-purple-900/40">
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
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-green-900/40 to-teal-900/40">
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
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-900/40 to-blue-900/40">
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
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-900/40 to-green-900/40">
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
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-cyan-900/40 to-blue-900/40">
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
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-amber-900/40 to-yellow-900/40">
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
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-orange-900/40 to-red-900/40">
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
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-lime-900/40 to-green-900/40">
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
              {/* Default for any other category */}
              {![
                "Mathematics",
                "Chemistry",
                "Physics",
                "Biology",
                "Computer Science",
                "Literature",
                "History",
                "Economics",
              ].includes(item.category) && (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-purple-900/40 to-blue-900/40">
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
          <div className="absolute bottom-2 left-2 rounded-md bg-purple-600/90 px-2 py-1 text-xs font-medium text-white">
            {item.category}
          </div>
        </div>

        {/* Content */}
        <h3 className="mb-1 text-lg font-bold text-white">{item.title}</h3>
        <p className="mb-3 line-clamp-2 text-sm text-slate-300">{item.description}</p>

        {/* Rating */}
        <div className="mb-3 flex items-center">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-white">{item.rating.toFixed(1)}</span>
          </div>
          <span className="mx-2 text-slate-500">•</span>
          <span className="text-sm text-slate-400">{item.sales} sales</span>
        </div>

        {/* Price and Author */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-white">{item.price}</div>
          <div className="truncate text-xs text-slate-400">by {item.author.substring(0, 6)}...</div>
        </div>
      </div>

      {/* Hover overlay with glow */}
      <div className="absolute inset-0 z-0 rounded-xl bg-gradient-to-r from-purple-600/0 to-blue-600/0 opacity-0 transition-all duration-300 group-hover:from-purple-600/20 group-hover:to-blue-600/20 group-hover:opacity-100"></div>
    </motion.div>
  )
}

