"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import SpaceBackground from "@/components/space-background"
import NFTCard from "@/components/nft-card"
import NFTModal from "@/components/nft-modal"
import Loader from "@/components/ui/cube-loader"
import { getAllMaterials } from "@/lib/blockchain"
import { useWallet } from "@/hooks/use-wallet"
import ClientOnly from "@/lib/client-only"
import SimpleFallback from "@/components/simple-fallback"

interface MaterialItem {
  id: string
  title: string
  description: string
  price: string
  author: string
  category: string
  image: string
  createdAt: string
  isActive: boolean
}

const CATEGORIES = [
  "All",
  "Blockchain",
  "Programming",
  "Design",
  "Business", 
  "Mathematics",
  "Science",
  "Language",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Literature",
  "History",
  "Economics",
  "Other"
]

// Function to get gradient based on subject category
function getCategoryGradient(subject: string): string {
  switch (subject?.toLowerCase()) {
    case 'all':
      return 'from-purple-700 via-violet-600 to-blue-600' // Default all categories
    case 'mathematics':
      return 'from-blue-700 via-indigo-600 to-purple-600'
    case 'chemistry':
      return 'from-green-700 via-teal-600 to-cyan-600'
    case 'physics':
      return 'from-purple-700 via-indigo-600 to-blue-600'
    case 'biology':
      return 'from-green-700 via-emerald-600 to-teal-600'
    case 'computer science':
      return 'from-blue-700 via-indigo-600 to-violet-600'
    case 'literature':
      return 'from-amber-700 via-orange-600 to-red-600'
    case 'history':
      return 'from-red-700 via-rose-600 to-pink-600'
    case 'economics':
      return 'from-emerald-700 via-green-600 to-teal-600'
    case 'blockchain':
      return 'from-purple-700 via-violet-600 to-blue-600'
    case 'programming':
      return 'from-blue-700 via-cyan-600 to-teal-600'
    case 'design':
      return 'from-pink-700 via-purple-600 to-indigo-600'
    case 'business':
      return 'from-blue-700 via-indigo-600 to-purple-600'
    case 'science':
      return 'from-cyan-700 via-blue-600 to-indigo-600'
    case 'language':
      return 'from-yellow-700 via-orange-600 to-red-600'
    default:
      return 'from-slate-700 via-slate-600 to-gray-600' // For "Other" or any undefined
  }
}

export default function MarketplacePage() {
  const { currentAccount } = useWallet()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [materials, setMaterials] = useState<MaterialItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MaterialItem[]>([])
  const [displayedItems, setDisplayedItems] = useState<MaterialItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MaterialItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Get search term from URL parameters
  useEffect(() => {
    if (searchParams) {
      // Get search param
      const search = searchParams.get("search")
      if (search) {
        setSearchTerm(search)
      } else {
        setSearchTerm("")
      }
      
      // Get sort param
      const sort = searchParams.get("sort")
      if (sort && ["newest", "price-low", "price-high"].includes(sort)) {
        setSortBy(sort)
      }
    }
  }, [searchParams])

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true)
        const fetchedMaterials = await getAllMaterials(0, 50)
        
        const formattedMaterials = fetchedMaterials
          .filter(material => 
            material?.id &&
            material?.title?.trim() &&
            material?.description?.trim() &&
            material?.price &&
            material?.owner?.trim() &&
            material?.category?.trim() &&
            material?.createdAt
          )
          .map(material => ({
            id: material.id.toString(),
            title: material.title.trim(),
            description: material.description.trim(),
            price: `${material.price} ETH`,
            author: material.owner.trim(),
            category: material.category.trim(),
            image: "/placeholder.svg?height=400&width=400",
            createdAt: material.createdAt,
            isActive: material.isActive ?? true
          }))
        
        setMaterials(formattedMaterials)
        setError(null)
      } catch (err) {
        console.error("Error fetching materials:", err)
        setError("Failed to load marketplace items. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterials()
  }, [])

  // Handle URL item parameter
  useEffect(() => {
    if (!searchParams) return;
    
    const itemIdParam = searchParams.get("item")
    
    if (itemIdParam && materials.length > 0) {
      // Find the item with the matching ID
      const foundItem = materials.find(item => item.id === itemIdParam)
      
      if (foundItem) {
        // Open the modal with the found item
        setSelectedItem(foundItem)
        setIsModalOpen(true)
      }
    }
  }, [searchParams, materials])

  useEffect(() => {
    let items = [...materials]

    if (searchTerm) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (category !== "All") {
      items = items.filter((item) => 
        item.category.toLowerCase() === category.toLowerCase() ||
        (item.category.toLowerCase() === 'computer-science' && category.toLowerCase() === 'computer science')
      )
    }

    if (sortBy === "price-low") {
      items.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    } else if (sortBy === "price-high") {
      items.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    } else if (sortBy === "newest") {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    setFilteredItems(items)
    setCurrentPage(1)
  }, [searchTerm, category, sortBy, materials])

  // Update displayed items based on pagination
  useEffect(() => {
    const endIndex = currentPage * itemsPerPage;
    setDisplayedItems(filteredItems.slice(0, endIndex));
  }, [filteredItems, currentPage, itemsPerPage]);

  const loadMoreItems = () => {
    setCurrentPage(prev => prev + 1);
  };

  const openModal = (item: MaterialItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  return (
    <main className="min-h-screen pt-12">
      <ClientOnly fallback={<SimpleFallback />}>
        <SpaceBackground 
          density={1500} 
          speed={0.0003} 
          shootingStars={true}
          cosmicDust={true}
          colorTheme="mixed"
          parallax={true}
          twinkleEffects={true}
        />
      </ClientOnly>

      <section className="relative py-8">
        <div className="container mx-auto px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-slate-900/0 to-transparent" />
          
          <div className="relative z-10">
            <div className="mx-auto mb-6 max-w-6xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col">
                
                {searchTerm && (
                  <p className="text-purple-400">
                    Showing results for "{searchTerm}"
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap justify-center gap-1">
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    className={`${
                      category === cat 
                        ? `bg-gradient-to-r ${getCategoryGradient(cat)} border-0 text-white` 
                        : 'border-slate-700 text-white hover:bg-black/20'
                    } text-[14px] px-2 py-1 h-auto transition-all duration-300`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-2">
              {isLoading && (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-20 w-20 mb-6">
                      <Loader size="lg" color="purple" />
                    </div>
                   
                  </div>
                </div>
              )}

              {error && !isLoading && (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-red-800 bg-black/50 p-8 backdrop-blur-sm">
                  <p className="text-center text-red-400">{error}</p>
                  <Button 
                    className="mt-4 bg-purple-600 hover:bg-purple-700"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {!isLoading && !error && filteredItems.length === 0 && (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-slate-800 bg-black/50 p-8 backdrop-blur-sm">
                  <p className="text-center text-slate-400">
                    {materials.length === 0 
                      ? "No materials are currently listed in the marketplace." 
                      : "No materials match your search criteria."}
                  </p>
                  {!currentAccount && materials.length === 0 && (
                    <p className="mt-4 text-center text-slate-400">
                      Connect your wallet to list your own study materials.
                    </p>
                  )}
                </div>
              )}

              {!isLoading && !error && filteredItems.length > 0 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {displayedItems.map((item, index) => (
                      <NFTCard key={item.id} item={item} onClick={() => openModal(item)} index={index} />
                    ))}
                  </div>
                  
                  {/* Load More Button */}
                  {filteredItems.length > displayedItems.length && (
                    <div className="mt-8 flex justify-center">
                      <Button 
                        variant="gradient-outline"
                        onClick={loadMoreItems}
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {selectedItem && (
        <NFTModal isOpen={isModalOpen} onClose={closeModal} item={selectedItem} />
      )}
    </main>
  )
}
