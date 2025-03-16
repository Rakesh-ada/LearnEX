"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { FileText, Video, Calendar } from "lucide-react"
import SubjectThumbnail from "./subject-thumbnail"

interface MaterialCardProps {
  material: {
    id: string
    title: string
    description: string
    type: string
    category?: string
    size: string
    purchaseDate: string
    image?: string
  }
  onClick: () => void
}

export default function MaterialCard({ material, onClick }: MaterialCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Determine if we should use a custom image or the subject thumbnail
  const hasCustomImage = !!material.image && material.image !== "/placeholder.svg" && !material.image.includes("placeholder")
  const category = material.category || (material.type === "pdf" ? "document" : "video")

  return (
    <motion.div
      ref={cardRef}
      className="group relative h-full cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Glowing border effect on hover */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-blue-500/0 opacity-0 transition-all duration-300 ${
          isHovered ? "from-purple-500/30 to-blue-500/30 opacity-100" : ""
        }`}
      ></div>

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Image */}
        <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
          {hasCustomImage ? (
            <div className="h-full w-full">
              <img 
                src={material.image} 
                alt={material.title} 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            </div>
          ) : (
            <SubjectThumbnail 
              category={category}
              width={300}
              height={169}
              className="w-full h-full"
              showTitle={false}
            />
          )}
          <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {material.type.toUpperCase()}
          </div>
        </div>

        {/* Content */}
        <h3 className="mb-1 text-lg font-bold text-white">{material.title}</h3>
        <p className="mb-3 line-clamp-2 text-sm text-slate-300">{material.description}</p>

        {/* Details */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            {new Date(material.purchaseDate).toLocaleDateString()}
          </div>
          <div>{material.size}</div>
        </div>
      </div>
    </motion.div>
  )
}

