"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Star, Share2, BookOpen, User, Loader2, ChevronRight, Info, Heart } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { purchaseMaterial } from "@/lib/blockchain"
import { getIPFSGatewayUrl, isValidIPFSCid } from "@/lib/pinning-service"
import { generatePixelThumbnail } from "@/lib/pixel-thumbnail-generator"

interface NFTModalProps {
  isOpen: boolean
  item: {
    id: string
    title: string
    description: string
    price: string
    author: string
    category: string
    image: string
    thumbnailHash?: string
    rating?: number
    sales?: number
    createdAt?: string
  }
  onClose: () => void
}

export default function NFTModal({ isOpen, item, onClose }: NFTModalProps) {
  const { currentAccount, connect } = useWallet()
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'preview'>('details')
  const [isLiked, setIsLiked] = useState(false)
  const [thumbnailError, setThumbnailError] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const hasThumbnail = item.thumbnailHash && isValidIPFSCid(item.thumbnailHash)
  const thumbnailUrl = hasThumbnail ? getIPFSGatewayUrl(item.thumbnailHash!) : ""
  const pixelThumbnailUrl = generatePixelThumbnail(item.title, item.category)

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Close modal on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscKey)

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [onClose])

  const handlePurchase = async () => {
    if (!currentAccount) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase this material.",
        variant: "destructive",
      })
      
      try {
        await connect()
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
      return
    }

    if (currentAccount.toLowerCase() === item.author.toLowerCase()) {
      toast({
        title: "Cannot purchase your own material",
        description: "You cannot purchase a material that you have listed.",
        variant: "destructive",
      })
      return
    }

    setIsPurchasing(true)
    
    try {
      // Extract the numeric price value from the price string (e.g., "0.05 ETH" -> "0.05")
      const priceValue = item.price.split(" ")[0]
      
      toast({
        title: "Purchase initiated",
        description: "Please confirm the transaction in your wallet.",
      })
      
      // Call the blockchain purchase function
      const success = await purchaseMaterial(parseInt(item.id), priceValue)
      
      if (success) {
        toast({
          title: "Purchase successful!",
          description: "The study material is now available in your collection.",
        })
        onClose()
      } else {
        throw new Error("Transaction failed or was rejected")
      }
    } catch (error) {
      console.error("Error purchasing material:", error)
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  const toggleLike = () => {
    setIsLiked(prev => !prev)
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked 
        ? "This item has been removed from your favorites" 
        : "This item has been added to your favorites",
    })
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 shadow-2xl"
          >
            {/* Animated pattern background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.5' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}
                animate={{ 
                  backgroundPosition: ["0px 0px", "100px 100px"],
                  opacity: [0.05, 0.15, 0.05]
                }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </div>

            {/* Close button */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-4 top-4 z-10 rounded-full bg-slate-800/80 p-2 text-slate-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </motion.button>

            <div className="flex h-full flex-col md:flex-row">
              {/* Image section */}
              <div className="relative h-[350px] w-full md:h-auto md:w-1/2">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30"
                  animate={{ 
                    opacity: [0.6, 0.8, 0.6],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                <motion.div 
                  initial={{ scale: 1.05, opacity: 0.9 }}
                  animate={{ 
                    scale: [1.05, 1, 1.05],
                    opacity: [0.9, 1, 0.9]
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="h-full w-full relative overflow-hidden"
                >
                  {/* Display IPFS thumbnail if available and valid */}
                  {hasThumbnail && !thumbnailError ? (
                    <Image 
                      src={thumbnailUrl} 
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover transition-transform" 
                      onError={() => setThumbnailError(true)}
                    />
                  ) : (
                    <div className="h-full w-full relative">
                      {/* Fallback to pixel art thumbnail if no valid IPFS thumbnail */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
                        <div className="flex h-full items-center justify-center">
                          <div className="relative h-4/5 w-4/5 overflow-hidden rounded-md border border-white/10 shadow-[0_0_25px_rgba(123,97,255,0.2)]">
                            <Image
                              src={pixelThumbnailUrl}
                              alt={item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 600px"
                              className="object-contain"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 z-20 rounded-sm bg-black/70 px-2 py-1 text-xs text-white/80 backdrop-blur-sm">8-bit Pixel Art</div>
                    </div>
                  )}
                </motion.div>
                
                {/* Floating category badge */}
                <motion.div
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute left-4 top-4 z-10"
                >
                  <span className="rounded-md bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
                    {item.category}
                  </span>
                </motion.div>
                
                {/* Like button */}
                <motion.button
                  onClick={toggleLike}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-4 z-10 rounded-full bg-slate-800/60 p-2 backdrop-blur-sm"
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </motion.button>
              </div>

              {/* Content section */}
              <div className="flex w-full flex-col p-6 md:w-1/2 md:overflow-y-auto">
                {/* Header section with rating */}
                <motion.div 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-2 flex items-center justify-between"
                >
                  {item.rating !== undefined && (
                    <div className="flex items-center rounded-full bg-slate-800/60 px-3 py-1 backdrop-blur-sm">
                      <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-white">{item.rating.toFixed(1)}</span>
                      {item.sales !== undefined && (
                        <>
                          <span className="mx-2 text-slate-500">•</span>
                          <span className="text-sm text-slate-300">{item.sales} sales</span>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Title with animated underline */}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative mb-4"
                >
                  <h2 className="text-3xl font-bold leading-tight text-white">{item.title}</h2>
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "40%" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-2 h-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                </motion.div>

                {/* Tab navigation */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 flex border-b border-slate-800"
                >
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`relative px-4 py-2 text-sm font-medium ${
                      activeTab === 'details' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    Details
                    {activeTab === 'details' && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-purple-500 to-blue-500"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`relative px-4 py-2 text-sm font-medium ${
                      activeTab === 'preview' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    Preview
                    {activeTab === 'preview' && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-purple-500 to-blue-500"
                      />
                    )}
                  </button>
                </motion.div>

                {/* Content area */}
                <div className="flex-grow">
                  {activeTab === 'details' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Description */}
                      <p className="mb-6 text-slate-300">{item.description}</p>

                      {/* Author with improved style */}
                      <div className="mb-6 flex items-center rounded-lg bg-slate-800/30 p-3 backdrop-blur-sm">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Created by</p>
                          <p className="font-medium text-white">{item.author.substring(0, 6)}...{item.author.substring(item.author.length - 4)}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="mb-6 grid grid-cols-2 gap-4">
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: 0.1 }}
                          className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm"
                        >
                          <p className="text-sm text-slate-400">Format</p>
                          <p className="font-medium text-white">Digital Content</p>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: 0.2 }}
                          className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm"
                        >
                          <p className="text-sm text-slate-400">Category</p>
                          <p className="font-medium text-white">{item.category}</p>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: 0.3 }}
                          className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm"
                        >
                          <p className="text-sm text-slate-400">Blockchain</p>
                          <p className="font-medium text-white">Ethereum</p>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: 0.4 }}
                          className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm"
                        >
                          <p className="text-sm text-slate-400">Created</p>
                          <p className="font-medium text-white">
                            {item.createdAt 
                              ? new Date(item.createdAt).toLocaleDateString() 
                              : "Recently"}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'preview' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="flex h-[300px] flex-col items-center justify-center rounded-lg bg-slate-800/20 p-6 text-center backdrop-blur-sm"
                    >
                      <Info className="mb-4 h-10 w-10 text-slate-400" />
                      <h3 className="mb-2 text-xl font-medium text-white">Preview Sample</h3>
                      <p className="text-slate-400">
                        Preview content is available after connecting your wallet.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4 border-slate-700 text-white hover:border-purple-500 hover:bg-purple-500/10 hover:text-purple-300"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Access Preview
                      </Button>
                    </motion.div>
                  )}
                </div>

                {/* Price and purchase */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 flex items-center justify-between rounded-lg bg-slate-800/30 p-4 backdrop-blur-sm"
                >
                  <div>
                    <p className="text-sm text-slate-400">Price</p>
                    <p className="text-2xl font-bold text-white">{item.price}</p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-full bg-slate-700/80 p-2 text-white backdrop-blur-sm"
                    >
                      <Share2 className="h-4 w-4" />
                    </motion.button>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button 
                        onClick={handlePurchase} 
                        disabled={isPurchasing || (!!currentAccount && currentAccount.toLowerCase() === item.author.toLowerCase())}
                        className="relative px-6 py-2 font-medium"
                        style={{
                          background: "linear-gradient(to right, rgb(126, 34, 206), rgb(79, 70, 229))"
                        }}
                      >
                        <span className="absolute -inset-0.5 -z-10 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 opacity-30 blur-md"></span>
                        {isPurchasing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : currentAccount && currentAccount.toLowerCase() === item.author.toLowerCase() ? (
                          "You own this"
                        ) : (
                          <>
                            Purchase Now
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

