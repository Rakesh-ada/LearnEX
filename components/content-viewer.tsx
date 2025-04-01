"use client"

import { useState, useEffect } from "react"
import { Loader2, FileText, Video, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { pinByHash, isValidIPFSCid, fetchFromIPFS } from "@/lib/pinning-service"
import { getSecureContentUrl } from "@/lib/secure-content"

interface ContentViewerProps {
  contentHash: string
  title: string
  type: string
  onClose: () => void
}

export default function ContentViewer({ contentHash, title, type, onClose }: ContentViewerProps) {
  const { currentAccount } = useWallet()
  const [isLoading, setIsLoading] = useState(true)
  const [isValidIpfs, setIsValidIpfs] = useState(false)
  const [isPinning, setIsPinning] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [secureContentUrl, setSecureContentUrl] = useState<string | null>(null)

  useEffect(() => {
    const initializeContent = async () => {
      try {
        setIsLoading(true)
        
        // Check if the hash is an IPFS hash
        if (contentHash.startsWith("ipfs://")) {
          // Validate CID
          const isValidCid = isValidIPFSCid(contentHash)
          setIsValidIpfs(isValidCid)
          
          if (isValidCid) {
            // Generate secure URL
            const secureUrl = getSecureContentUrl(contentHash, type)
            setSecureContentUrl(secureUrl)
            
            // For PDFs, open directly in Chrome's viewer
            if (type === "pdf") {
              window.open(secureUrl, "_blank")
            }
          }
        }
      } catch (err) {
        console.error("Error initializing content:", err)
        toast({
          title: "Error",
          description: "Failed to initialize content viewer.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    initializeContent()
  }, [contentHash, title, type])

  const handleOpenInChrome = () => {
    if (secureContentUrl) {
      window.open(secureContentUrl, "_blank")
      toast({
        title: "Content Opened",
        description: `${type.toUpperCase()} is now open in a new tab.`,
      })
    }
  }

  const handleDownloadContent = async () => {
    if (!currentAccount) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to download this content.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsDownloading(true)
      
      if (contentHash.startsWith("ipfs://") && isValidIpfs) {
        // Fetch the actual content from IPFS
        const blob = await fetchFromIPFS(contentHash)
        
        // Determine the file extension based on the content type
        let fileExtension = '.txt'
        if (type === 'pdf') {
          fileExtension = '.pdf'
        } else if (type === 'video') {
          fileExtension = '.mp4'
        }
        
        // Create a download link
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}${fileExtension}`
        document.body.appendChild(a)
        a.click()
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }, 100)
        
        toast({
          title: "Download Started",
          description: "Your content is being downloaded.",
        })
      }
    } catch (err) {
      console.error("Error downloading content:", err)
      toast({
        title: "Download Failed",
        description: "Failed to download content. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePinContent = async () => {
    if (!currentAccount) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to save this content.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsPinning(true)
      
      // Pin the content using Pinata
      const success = await pinByHash(contentHash, title);
      
      if (success) {
        setIsPinned(true)
        toast({
          title: "Content Saved",
          description: "This content has been saved for offline access.",
        })
      } else {
        toast({
          title: "Saving Failed",
          description: "Failed to save content. Please try again later.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error saving content:", err)
      toast({
        title: "Error",
        description: "An error occurred while saving the content.",
        variant: "destructive",
      })
    } finally {
      setIsPinning(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-white flex items-center">
          {type === "pdf" ? (
            <FileText className="mr-2 h-5 w-5 text-purple-400" />
          ) : type === "video" ? (
            <Video className="mr-2 h-5 w-5 text-purple-400" />
          ) : (
            <FileText className="mr-2 h-5 w-5 text-purple-400" />
          )}
          {title}
        </h2>
        
        {isLoading ? (
          <div className="flex py-6 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            <span className="ml-2 text-white">Loading content...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-white/80">
              {type === "pdf" 
                ? "The PDF has been opened in Chrome's built-in PDF viewer. If it didn't open, click the button below."
                : type === "video"
                ? "Click below to view or download this video content."
                : "Click below to view or download this content."}
            </p>
            
            <div className="flex flex-col gap-2">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleOpenInChrome}
                disabled={!secureContentUrl}
              >
                {type === "pdf" ? (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Open PDF in Chrome
                  </>
                ) : type === "video" ? (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Open Video
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Open Content
                  </>
                )}
              </Button>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleDownloadContent}
                disabled={isDownloading}
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? "Downloading..." : `Download ${type.toUpperCase()}`}
              </Button>
              
              {contentHash.startsWith("ipfs://") && (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handlePinContent}
                  disabled={isPinned || isPinning}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isPinned ? "Saved" : isPinning ? "Saving..." : "Save for Offline"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 