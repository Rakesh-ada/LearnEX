"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Star, Share2, BookOpen, User, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { purchaseMaterial } from "@/lib/blockchain"

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
    rating?: number
    sales?: number
    createdAt?: string
  }
  onClose: () => void
}

export default function NFTModal({ isOpen, item, onClose }: NFTModalProps) {
  const { currentAccount, connect } = useWallet()
  const [isPurchasing, setIsPurchasing] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image section */}
          <div className="relative h-[300px] w-full md:h-auto md:w-1/2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20"></div>
            <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
          </div>

          {/* Content section */}
          <div className="flex w-full flex-col p-6 md:w-1/2 md:overflow-y-auto">
            <div className="mb-2 flex items-center">
              <span className="rounded-md bg-purple-600/90 px-2 py-1 text-xs font-medium text-white">
                {item.category}
              </span>
              {item.rating !== undefined && (
                <div className="ml-auto flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-white">{item.rating.toFixed(1)}</span>
                  {item.sales !== undefined && (
                    <>
                      <span className="mx-2 text-slate-500">•</span>
                      <span className="text-sm text-slate-400">{item.sales} sales</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <h2 className="mb-4 text-2xl font-bold text-white">{item.title}</h2>

            <p className="mb-6 text-slate-300">{item.description}</p>

            {/* Author */}
            <div className="mb-6 flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Created by</p>
                <p className="font-medium text-white">{item.author.substring(0, 6)}...{item.author.substring(item.author.length - 4)}</p>
              </div>
            </div>

            {/* Details */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-slate-800 p-4">
                <p className="text-sm text-slate-400">Format</p>
                <p className="font-medium text-white">Digital Content</p>
              </div>
              <div className="rounded-lg bg-slate-800 p-4">
                <p className="text-sm text-slate-400">Category</p>
                <p className="font-medium text-white">{item.category}</p>
              </div>
              <div className="rounded-lg bg-slate-800 p-4">
                <p className="text-sm text-slate-400">Blockchain</p>
                <p className="font-medium text-white">Ethereum</p>
              </div>
              <div className="rounded-lg bg-slate-800 p-4">
                <p className="text-sm text-slate-400">Created</p>
                <p className="font-medium text-white">
                  {item.createdAt 
                    ? new Date(item.createdAt).toLocaleDateString() 
                    : "Recently"}
                </p>
              </div>
            </div>

            {/* Preview button */}
            <Button variant="outline" className="mb-6 border-slate-700 text-white">
              <BookOpen className="mr-2 h-4 w-4" />
              Preview Sample
            </Button>

            {/* Price and purchase */}
            <div className="mt-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Price</p>
                <p className="text-2xl font-bold text-white">{item.price}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="border-slate-700 text-white">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handlePurchase} 
                  disabled={isPurchasing || (!!currentAccount && currentAccount.toLowerCase() === item.author.toLowerCase())}
                  className="relative bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  <span className="absolute -inset-0.5 -z-10 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 opacity-30 blur-sm"></span>
                  {isPurchasing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : currentAccount && currentAccount.toLowerCase() === item.author.toLowerCase() ? (
                    "You own this"
                  ) : (
                    "Purchase Now"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

