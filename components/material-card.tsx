"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { FileText, Video, Calendar } from "lucide-react"
import Image from "next/image"
import { getIPFSGatewayUrl, isValidIPFSCid } from "@/lib/pinning-service"
import { generatePixelThumbnail } from "@/lib/pixel-thumbnail-generator"

interface MaterialCardProps {
  material: {
    id: string
    title: string
    description: string
    type: string
    size: string
    purchaseDate: string
    image?: string
    thumbnailHash?: string
  }
  onClick: () => void
}

export default function MaterialCard({ material, onClick }: MaterialCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [thumbnailError, setThumbnailError] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const hasThumbnail = material.thumbnailHash && isValidIPFSCid(material.thumbnailHash)
  const thumbnailUrl = hasThumbnail ? getIPFSGatewayUrl(material.thumbnailHash!) : ""
  const pixelThumbnailUrl = generatePixelThumbnail(material.title, material.type)

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
        {/* Image with type-based thumbnail */}
        <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
          {hasThumbnail && !thumbnailError ? (
            <>
              <Image
                src={thumbnailUrl}
                alt={material.title}
                width={300}
                height={200}
                className="h-full w-full object-cover"
                onError={() => setThumbnailError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
            </>
          ) : (
            <>
              {/* 8-bit Pixel Art Thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="flex h-full items-center justify-center">
                  <div className="relative h-4/5 w-4/5 overflow-hidden rounded-md border border-white/10">
                    <Image
                      src={pixelThumbnailUrl}
                      alt={material.title}
                      width={300}
                      height={200}
                      className="h-full w-full"
                    />
                    
                    {/* Type icon overlay */}
                    <div className="absolute bottom-2 left-2 flex items-center rounded bg-black/60 p-1 backdrop-blur-sm">
                      {material.type === "pdf" ? (
                        <FileText className="h-3 w-3 text-purple-400" />
                      ) : material.type === "video" ? (
                        <Video className="h-3 w-3 text-blue-400" />
                      ) : (
                        <FileText className="h-3 w-3 text-slate-400" />
                      )}
                      <span className="ml-1 text-[10px] text-white/70">{material.type}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-1 right-1 z-10 rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] text-white/70">8-bit</div>
            </>
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

