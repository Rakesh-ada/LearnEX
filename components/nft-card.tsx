"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import SubjectThumbnail from "./subject-thumbnail"

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

  // Determine if we should use a custom image or the subject thumbnail
  const hasCustomImage = !!item.image && item.image !== "/placeholder.svg" && !item.image.includes("placeholder")
  const hasThumbnailHash = !!item.thumbnailHash && item.thumbnailHash !== "ipfs://QmdefaultEmptyThumbnailHash"

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
        {/* Image */}
        <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
          {hasCustomImage || hasThumbnailHash ? (
            <>
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div className="absolute bottom-2 left-2 rounded-md bg-purple-600/90 px-2 py-1 text-xs font-medium text-white">
                {item.category}
              </div>
            </>
          ) : (
            <SubjectThumbnail 
              category={item.category}
              width={300}
              height={300}
              className="w-full h-full"
              showTitle={false}
            />
          )}
        </div>

        {/* Content */}
        <h3 className="mb-1 text-lg font-bold text-white">{item.title}</h3>
        <p className="mb-3 line-clamp-2 text-sm text-slate-300">{item.description}</p>

        {/* Rating - Only show if rating exists */}
        {item.rating !== undefined && (
          <div className="mb-3 flex items-center">
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-white">{item.rating.toFixed(1)}</span>
            </div>
            {item.sales !== undefined && (
              <>
                <span className="mx-2 text-slate-500">•</span>
                <span className="text-sm text-slate-400">{item.sales} sales</span>
              </>
            )}
          </div>
        )}

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

