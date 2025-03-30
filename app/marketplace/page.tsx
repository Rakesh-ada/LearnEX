"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SpaceBackground from "@/components/space-background"
import NFTCard from "@/components/nft-card"
import NFTModal from "@/components/nft-modal"
import { Search, SlidersHorizontal, Loader2, ArrowUpDown } from "lucide-react"
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
    <main className="min-h-screen pt-12"> {/* Reduced from pt-16 */}
      <ClientOnly fallback={<SimpleFallback />}>
        <SpaceBackground density={800} speed={0.0003} />
      </ClientOnly>

      <section className="relative py-8"> {/* Reduced from py-16 */}
        <div className="container mx-auto px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-slate-900/0 to-transparent" />
          
          <div className="relative z-10">
            <div className="relative z-10">
              <div className="mx-auto mb-6 max-w-3xl"> {/* Reduced from mb-20 */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 z-20">
                      <Search className="h-5 w-5 text-purple-400/90" />
                    </div>
                    
                    <Input
                      type="text"
                      placeholder="Search study materials..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-700/50 bg-slate-900/50 pl-12 pr-[140px] text-white 
                        shadow-lg shadow-purple-500/5 backdrop-blur-sm placeholder:text-slate-400 
                        focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10"
                    />
                    
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger 
                          className="h-9 w-[110px] border-0 bg-transparent text-white/80 
                            hover:text-white focus:ring-0 focus:ring-offset-0"
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <ArrowUpDown className="h-4 w-4 text-purple-400/80" />
                            {sortBy === "newest" ? "New " : 
                             sortBy === "price-low" ? "Low " :
                             sortBy === "price-high" ? "High " : "Sort"}
                          </div>
                        </SelectTrigger>
                        <SelectContent 
                          className="rounded-lg border border-slate-700/50 bg-slate-900/90 
                            text-white shadow-xl shadow-purple-500/10 backdrop-blur-md min-w-[140px]"
                        >
                          <SelectItem 
                            value="newest"
                            className="hover:bg-purple-500/20 focus:bg-purple-500/20"
                          >
                            Newest First
                          </SelectItem>
                          <SelectItem 
                            value="price-low"
                            className="hover:bg-purple-500/20 focus:bg-purple-500/20"
                          >
                            Price: Lowest
                          </SelectItem>
                          <SelectItem 
                            value="price-high"
                            className="hover:bg-purple-500/20 focus:bg-purple-500/20"
                          >
                            Price: Highest
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isFilterOpen && (
              <div className="mt-4 rounded-md border border-slate-700 bg-slate-900 p-4 md:hidden">
                <h3 className="mb-2 font-medium text-white">Categories</h3>
                <div className="flex flex-wrap gap-1">
                  {CATEGORIES.map((cat) => (
                    <Button
                      key={cat}
                      variant={category === cat ? "default" : "outline"}
                      size="sm"
                      className={`${category === cat ? "bg-purple-600" : "border-slate-700 text-white"} text-xs px-2 py-1 h-auto`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 hidden md:block"> {/* Reduced from mb-8 */}
              <div className="flex flex-wrap justify-center gap-1">
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    className={`${category === cat ? "bg-purple-600" : "border-slate-700 text-white"} text-xs px-2 py-1 h-auto`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-2"> {/* Added pt-2 */}
              {isLoading && (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="flex flex-col items-center">
                    <Loader2 className="mb-4 h-10 w-10 animate-spin text-purple-500" />
                    <p className="text-white">Loading marketplace items...</p>
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> {/* Reduced from gap-6 */}
                  {filteredItems.map((item) => (
                    <NFTCard key={item.id} item={item} onClick={() => openModal(item)} />
                  ))}
                </div>
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
