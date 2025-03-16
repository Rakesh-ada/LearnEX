"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SpaceBackground from "@/components/space-background"
import NFTCard from "@/components/nft-card"
import NFTModal from "@/components/nft-modal"
import { Search, SlidersHorizontal, Loader2 } from "lucide-react"
import { getAllMaterials } from "@/lib/blockchain"
import { useWallet } from "@/hooks/use-wallet"
import ClientOnly from "@/lib/client-only"
import SimpleFallback from "@/components/simple-fallback"

// Define the material item type
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

// Categories for filtering
const CATEGORIES = [
  "All",
  "Mathematics",
  "Chemistry",
  "Physics",
  "Biology",
  "Computer Science",
  "Literature",
  "History",
  "Economics",
]

export default function MarketplacePage() {
  const { currentAccount } = useWallet()
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("All")
  const [sortBy, setSortBy] = useState("popular")
  const [materials, setMaterials] = useState<MaterialItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MaterialItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MaterialItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch materials from blockchain
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true)
        const fetchedMaterials = await getAllMaterials(0, 50) // Fetch up to 50 materials
        
        // Transform the data to match the expected format
        const formattedMaterials = fetchedMaterials.map(material => ({
          id: material.id.toString(),
          title: material.title,
          description: material.description,
          price: `${material.price} ETH`,
          author: material.owner,
          category: material.category,
          image: "/placeholder.svg?height=400&width=400", // Default image
          createdAt: material.createdAt,
          isActive: material.isActive
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

  // Filter and sort items based on search, category, and sort criteria
  useEffect(() => {
    let items = [...materials]

    // Apply search filter
    if (searchTerm) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (category !== "All") {
      items = items.filter((item) => item.category === category)
    }

    // Apply sorting
    if (sortBy === "price-low") {
      items.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    } else if (sortBy === "price-high") {
      items.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    } else if (sortBy === "newest") {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    setFilteredItems(items)
  }, [searchTerm, category, sortBy, materials])

  const openModal = (item: MaterialItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  return (
    <main className="min-h-screen pt-16">
      <ClientOnly fallback={<SimpleFallback />}>
        <SpaceBackground density={800} speed={0.0003} />
      </ClientOnly>

      {/* Header */}
      <section className="relative py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-center text-4xl font-bold text-white">Study Material Marketplace</h1>
          <p className="mx-auto mb-8 max-w-2xl text-center text-lg text-slate-300">
            Discover and purchase high-quality study material.
          </p>

          {/* Search and Filter */}
          <div className="mx-auto mb-8 max-w-4xl">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search study materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-slate-700 bg-slate-900 pl-10 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] border-slate-700 bg-slate-900 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-700 bg-slate-900 text-white">
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-900 text-white md:hidden"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mobile Filters */}
            {isFilterOpen && (
              <div className="mt-4 rounded-md border border-slate-700 bg-slate-900 p-4 md:hidden">
                <h3 className="mb-2 font-medium text-white">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <Button
                      key={cat}
                      variant={category === cat ? "default" : "outline"}
                      size="sm"
                      className={`mr-2 ${category === cat ? "bg-purple-600" : "border-slate-700 text-white"}`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Category Filters */}
          <div className="mb-8 hidden md:block">
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  className={`${category === cat ? "bg-purple-600" : "border-slate-700 text-white"}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-purple-500" />
                <p className="text-white">Loading marketplace items...</p>
              </div>
            </div>
          )}

          {/* Error State */}
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

          {/* Empty State */}
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

          {/* Materials Grid */}
          {!isLoading && !error && filteredItems.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <NFTCard key={item.id} item={item} onClick={() => openModal(item)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Material Detail Modal */}
      {selectedItem && (
        <NFTModal isOpen={isModalOpen} onClose={closeModal} item={selectedItem} />
      )}
    </main>
  )
}

