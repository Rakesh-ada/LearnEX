"use client"

import { useState } from "react"
import { Loader2, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SpaceBackground from "@/components/space-background"
import WebNFTCard from "@/components/web-nft-card"
import { getTitleToCID } from "@/lib/pixel-thumbnail-generator"
import { WebThumbnailsNav } from "@/components/web-thumbnails-nav"

// Sample data for the marketplace
const SAMPLE_MATERIALS = [
  {
    id: "1",
    title: "Introduction to Blockchain Technology",
    description: "Learn the fundamentals of blockchain technology, including distributed ledgers, consensus mechanisms, and cryptographic principles.",
    price: "0.05 ETH",
    author: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    category: "blockchain",
    rating: 4.8,
    sales: 132
  },
  {
    id: "2",
    title: "Advanced React Development",
    description: "Master advanced React patterns, performance optimization techniques, and state management strategies for complex applications.",
    price: "0.08 ETH",
    author: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    category: "programming",
    rating: 4.9,
    sales: 215
  },
  {
    id: "3",
    title: "UI/UX Design Fundamentals",
    description: "Explore the principles of user interface and user experience design, including layout, typography, color theory, and usability testing.",
    price: "0.04 ETH",
    author: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    category: "design",
    rating: 4.7,
    sales: 98
  },
  {
    id: "4",
    title: "Cryptography and Security",
    description: "Deep dive into cryptographic algorithms, digital signatures, encryption methods, and their applications in securing digital systems.",
    price: "0.09 ETH",
    author: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    category: "computer-science",
    rating: 4.6,
    sales: 76
  },
  {
    id: "5",
    title: "Quantum Physics Explained",
    description: "Understand the principles of quantum mechanics, wave-particle duality, quantum entanglement, and applications in modern technology.",
    price: "0.07 ETH",
    author: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    category: "physics",
    rating: 4.5,
    sales: 62
  },
  {
    id: "6",
    title: "Modern Web Development",
    description: "Comprehensive guide to modern web development using JavaScript frameworks, responsive design principles, and performance optimization.",
    price: "0.06 ETH",
    author: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    category: "programming",
    rating: 4.7,
    sales: 143
  }
]

export default function WebThumbnailsMarketplace() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null)
  
  // Filter materials based on search term
  const filteredMaterials = SAMPLE_MATERIALS.filter(material => 
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Handle material selection
  const handleMaterialClick = (id: string) => {
    setSelectedMaterial(id)
    // In a real application, this would navigate to a details page
    // or open a modal with more information
    console.log(`Selected material: ${id}`)
  }
  
  return (
    <div className="relative min-h-screen">
      {/* Enhanced space background with higher density and twinkling effects */}
      <SpaceBackground 
        density={1500} 
        speed={0.0003} 
        shootingStars={true}
        cosmicDust={true}
        colorTheme="mixed"
        parallax={true}
        twinkleEffects={true}
      />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-6 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white">Web-Enhanced Marketplace</h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-300">
              Discover educational materials with unique web-based 8-bit pixel art thumbnails
            </p>
          </div>
          
          <WebThumbnailsNav />
          
          {/* Search bar */}
          <div className="mx-auto mb-12 max-w-lg">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search materials..."
                className="bg-slate-900/70 border-slate-700 pl-10 pr-4 py-3 text-white backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          
          {/* Materials grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material) => (
                <WebNFTCard
                  key={material.id}
                  item={{
                    ...material,
                    // Generate a thumbnail hash for materials that don't have one
                    thumbnailHash: material.id === "1" ? getTitleToCID(material.title, material.category) : undefined
                  }}
                  onClick={() => handleMaterialClick(material.id)}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-xl text-slate-400">
                  No materials found matching your search.
                </p>
                <Button
                  className="mt-4 bg-purple-600 hover:bg-purple-700"
                  onClick={() => setSearchTerm("")}
                >
                  Reset Search
                </Button>
              </div>
            )}
          </div>
          
          {/* Feature explanation section */}
          <div className="mx-auto mt-20 max-w-4xl rounded-xl bg-slate-900/70 p-8 backdrop-blur-md">
            <h2 className="mb-6 text-2xl font-bold text-white">Web-Enhanced 8-bit Thumbnails</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-purple-400">How It Works</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-400">•</span>
                    Our system searches the web for images related to the material's topic
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-400">•</span>
                    The best matching image is converted into 8-bit pixel art
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-400">•</span>
                    The color palette is optimized based on the material's category
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-400">•</span>
                    The result is a unique, visually appealing thumbnail
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-lg font-semibold text-purple-400">Benefits</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-400">•</span>
                    Enhanced visual representation of each material's content
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-400">•</span>
                    Unique thumbnails that stand out in the marketplace
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-400">•</span>
                    Improved user experience with visually engaging content
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-400">•</span>
                    Each thumbnail is saved as an NFT on the blockchain
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 