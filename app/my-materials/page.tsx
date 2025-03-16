"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MaterialCard from "@/components/material-card"
import { BookOpen, FileText, Video, Download, Lock, Loader2 } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { getMyPurchasedMaterials, getContentHash } from "@/lib/blockchain"
import { toast } from "@/hooks/use-toast"
import ContentViewer from "@/components/content-viewer"
import SpaceBackground from "@/components/space-background"
import ClientOnly from "@/lib/client-only"
import SimpleFallback from "@/components/simple-fallback"

export default function MyMaterialsPage() {
  const { currentAccount, connect } = useWallet()
  const [activeTab, setActiveTab] = useState("all")
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null)
  const [purchasedMaterials, setPurchasedMaterials] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contentHash, setContentHash] = useState<string | null>(null)
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [showContentViewer, setShowContentViewer] = useState(false)

  // Fetch purchased materials when wallet is connected
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!currentAccount) return

      try {
        setIsLoading(true)
        setError(null)
        
        const materials = await getMyPurchasedMaterials()
        
        // Transform the data for display
        const formattedMaterials = materials.map((material: any) => {
          // Guess the file type based on the title
          const type = guessFileType(material.title)
          
          return {
            id: material.id.toString(),
            title: material.title,
            description: material.description,
            type: type,
            size: type === "pdf" ? "2.4 MB" : "45 MB", // Placeholder sizes
            purchaseDate: new Date().toISOString(), // Placeholder date
            image: "",
          }
        })
        
        setPurchasedMaterials(formattedMaterials)
        
        if (formattedMaterials.length === 0) {
          setError("You haven't purchased any materials yet.")
        }
      } catch (err) {
        console.error("Error fetching materials:", err)
        setError("Failed to load your materials. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (currentAccount) {
      fetchMaterials()
    } else {
      setIsLoading(false)
    }
  }, [currentAccount])

  // Helper function to guess file type based on title
  const guessFileType = (title: string): string => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes("video") || lowerTitle.includes(".mp4") || lowerTitle.includes(".mov") || lowerTitle.includes(".avi")) {
      return "video"
    }
    return "pdf" // Default to PDF
  }

  // Handle selecting a material
  const handleSelectMaterial = async (material: any) => {
    try {
      if (!currentAccount) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to view this content.",
          variant: "destructive",
        })
        return
      }
      
      setIsLoadingContent(true)
      setSelectedMaterial(material)
      
      // Fetch content hash
      const hash = await getContentHash(parseInt(material.id))
      setContentHash(hash)
      
      // Open content viewer directly if hash is available
      if (hash) {
        setShowContentViewer(true)
      } else {
        toast({
          title: "Content Not Available",
          description: "The content hash could not be retrieved. Please try again.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error fetching content hash:", err)
      toast({
        title: "Error",
        description: "Failed to retrieve content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingContent(false)
    }
  }

  // Handle closing content viewer
  const handleCloseContentViewer = () => {
    setShowContentViewer(false)
    setSelectedMaterial(null)
    setContentHash(null)
  }

  // Filter materials based on active tab
  const filteredMaterials = purchasedMaterials.filter((material) => {
    if (activeTab === "all") return true
    return material.type === activeTab
  })

  return (
    <main className="min-h-screen pt-16">
      <ClientOnly fallback={<SimpleFallback />}>
        <SpaceBackground colorTheme="blue" shootingStars={true} />
      </ClientOnly>
      
      <section className="container py-12">
        <div className="mx-auto max-w-7xl backdrop-blur-sm bg-black/20 rounded-xl p-8 border border-slate-800">
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">My Materials</h1>
          <p className="mb-8 text-lg text-slate-400">Access your purchased study materials</p>

          {isLoading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-slate-800 bg-black/50 p-8 backdrop-blur-sm">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-purple-500" />
              <p className="text-white">Loading your materials...</p>
            </div>
          ) : !currentAccount ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-slate-800 bg-black/50 p-8 backdrop-blur-sm">
              <Lock className="mb-4 h-16 w-16 text-purple-500" />
              <h2 className="mb-2 text-xl font-bold text-white">Connect Your Wallet</h2>
              <p className="mb-6 text-center text-slate-400">
                Please connect your wallet to view your purchased materials.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={connect}>
                Connect Wallet
              </Button>
            </div>
          ) : error ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-slate-800 bg-black/50 p-8 backdrop-blur-sm">
              <BookOpen className="mb-4 h-16 w-16 text-purple-500" />
              <h2 className="mb-2 text-xl font-bold text-white">No Materials Found</h2>
              <p className="mb-6 text-center text-slate-400">{error}</p>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => window.location.href = "/"}>
                Browse Marketplace
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList className="bg-slate-900">
                  <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
                    All Materials
                  </TabsTrigger>
                  <TabsTrigger value="pdf" className="data-[state=active]:bg-purple-600">
                    <FileText className="mr-2 h-4 w-4" />
                    PDFs
                  </TabsTrigger>
                  <TabsTrigger value="video" className="data-[state=active]:bg-purple-600">
                    <Video className="mr-2 h-4 w-4" />
                    Videos
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-400">
                    {filteredMaterials.length} {filteredMaterials.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              {isLoadingContent && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="rounded-lg bg-slate-900 p-6 shadow-xl">
                    <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-purple-500" />
                    <p className="text-center text-white">Loading content...</p>
                  </div>
                </div>
              )}

              {!isLoading && !error && filteredMaterials.length > 0 && (
                <>
                  <TabsContent value="all" className="mt-0">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredMaterials.map((material) => (
                        <MaterialCard key={material.id} material={material} onClick={() => handleSelectMaterial(material)} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="pdf" className="mt-0">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredMaterials.map((material) => (
                        <MaterialCard key={material.id} material={material} onClick={() => handleSelectMaterial(material)} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="video" className="mt-0">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredMaterials.map((material) => (
                        <MaterialCard key={material.id} material={material} onClick={() => handleSelectMaterial(material)} />
                      ))}
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
          )}

          {/* Content Viewer Modal */}
          {showContentViewer && selectedMaterial && contentHash && (
            <ContentViewer
              contentHash={contentHash}
              title={selectedMaterial.title}
              type={selectedMaterial.type}
              onClose={handleCloseContentViewer}
            />
          )}
        </div>
      </section>
    </main>
  )
}

