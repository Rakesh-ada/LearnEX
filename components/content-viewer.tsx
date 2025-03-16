"use client"

import { useState, useEffect } from "react"
import { Loader2, FileText, Video, Download, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { pinByHash, isValidIPFSCid, getIPFSGatewayUrl, fetchFromIPFS } from "@/lib/pinning-service"

interface ContentViewerProps {
  contentHash: string
  title: string
  type: string
  onClose: () => void
}

export default function ContentViewer({ contentHash, title, type, onClose }: ContentViewerProps) {
  const { currentAccount } = useWallet()
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isValidIpfs, setIsValidIpfs] = useState(false)
  const [showInternalViewer, setShowInternalViewer] = useState(false)
  const [isPinning, setIsPinning] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [ipfsGatewayUrl, setIpfsGatewayUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setIsValidIpfs(false)
        setIpfsGatewayUrl(null)
        
        // Check if the hash is an IPFS hash (starts with "ipfs://")
        if (contentHash.startsWith("ipfs://")) {
          const cid = contentHash.replace("ipfs://", "")
          
          // Use the utility function to validate the CID
          const isValidCid = isValidIPFSCid(contentHash)
          setIsValidIpfs(isValidCid)
          
          if (isValidCid) {
            // Get the gateway URL
            const gatewayUrl = getIPFSGatewayUrl(contentHash)
            setIpfsGatewayUrl(gatewayUrl)
            
            // For the preview, we'll still use placeholder content
            if (type === "pdf") {
              setContent(`
                # ${title}
                
                This PDF document is available for viewing or download.
                
                The content is stored on IPFS with the following CID:
                ${cid}
                
                You can:
                1. View it in the LearnEX Viewer
                2. Download it directly
                3. Save it for offline access
              `)
            } else {
              // For video content
              setContent(`
                # ${title} (Video)
                
                This video is available for viewing or download.
                
                The content is stored on IPFS with the following CID:
                ${cid}
                
                You can:
                1. View it in the LearnEX Viewer
                2. Download it directly
                3. Save it for offline access
              `)
            }
          } else {
            // Invalid CID
            setContent(`
              # ${title}
              
              This content has an invalid IPFS identifier.
              
              Please contact support if you continue to experience issues.
            `)
          }
        } else {
          // Handle other types of content hashes
          setContent(`
              # ${title}
              
              This content is available for viewing within the LearnEX platform.
              
              In a production environment, you would:
              1. Fetch the content from our secure storage
              2. Display it in an appropriate viewer
              
              For now, this text representation serves as a placeholder.
          `)
        }
      } catch (err) {
        console.error("Error fetching content:", err)
        setError("Failed to load content. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [contentHash, title, type])

  const handleViewInternally = () => {
    setShowInternalViewer(true)
    
    toast({
      title: "Viewer Activated",
      description: "Viewing content within the LearnEX platform.",
    })
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
          description: "Your content is being downloaded from IPFS.",
        })
      } else {
        // Fallback for non-IPFS content or invalid CIDs
        const fileContent = `Content for "${title}"\n\nThis is a placeholder for content that couldn't be retrieved from IPFS.`
        const blob = new Blob([fileContent], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        
        // Create a temporary link element and trigger download
        const a = document.createElement('a')
        a.href = url
        a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
        document.body.appendChild(a)
        a.click()
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }, 100)
        
        toast({
          title: "Download Started",
          description: "A placeholder file is being downloaded as the actual content couldn't be retrieved.",
          variant: "destructive",
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
          title: "Content Saved Successfully",
          description: "This content has been saved and will remain accessible.",
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

  const renderInternalViewer = () => {
    if (!ipfsGatewayUrl && contentHash.startsWith("ipfs://") && isValidIpfs) {
      // Get the gateway URL if not already set
      const gatewayUrl = getIPFSGatewayUrl(contentHash)
      setIpfsGatewayUrl(gatewayUrl)
    }
    
    if (type === "pdf" && ipfsGatewayUrl) {
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">PDF Viewer</h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-600 text-white"
              onClick={() => setShowInternalViewer(false)}
            >
              Back to Content
            </Button>
          </div>
          <div className="aspect-video rounded-lg bg-slate-900 flex flex-col items-center justify-center">
            {isValidIpfs ? (
              <iframe 
                src={`${ipfsGatewayUrl}#toolbar=0`} 
                className="h-full w-full rounded-lg"
                title={title}
              />
            ) : (
              <div className="text-center p-6">
                <FileText className="mx-auto mb-4 h-16 w-16 text-purple-400" />
                <h4 className="mb-2 text-lg font-medium text-white">{title}</h4>
                <p className="mb-4 text-sm text-slate-400">
                  Unable to display PDF. The content may be unavailable or in an unsupported format.
                </p>
                <div className="flex justify-center">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleDownloadContent}
                    disabled={isDownloading}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading ? "Downloading..." : "Download PDF"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    } else if (type === "video" && ipfsGatewayUrl) {
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Video Player</h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-600 text-white"
              onClick={() => setShowInternalViewer(false)}
            >
              Back to Content
            </Button>
          </div>
          <div className="aspect-video rounded-lg bg-slate-900 flex items-center justify-center">
            {isValidIpfs ? (
              <video 
                controls 
                className="h-full w-full rounded-lg"
                src={ipfsGatewayUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center p-6">
                <Video className="mx-auto mb-4 h-16 w-16 text-purple-400" />
                <h4 className="mb-2 text-lg font-medium text-white">{title}</h4>
                <p className="mb-4 text-sm text-slate-400">
                  Unable to display video. The content may be unavailable or in an unsupported format.
                </p>
                <div className="flex justify-center">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleDownloadContent}
                    disabled={isDownloading}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading ? "Downloading..." : "Download Video"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    } else {
      // Fallback for other content types or when gateway URL is not available
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Content Viewer</h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-600 text-white"
              onClick={() => setShowInternalViewer(false)}
            >
              Back to Content
            </Button>
          </div>
          <div className="aspect-video rounded-lg bg-slate-900 flex items-center justify-center">
            <div className="text-center p-6">
              {type === "pdf" ? (
                <FileText className="mx-auto mb-4 h-16 w-16 text-purple-400" />
              ) : (
                <Video className="mx-auto mb-4 h-16 w-16 text-purple-400" />
              )}
              <h4 className="mb-2 text-lg font-medium text-white">{title}</h4>
              <p className="mb-4 text-sm text-slate-400">
                Unable to display content. The content may be unavailable or in an unsupported format.
              </p>
              <div className="flex justify-center">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={handleDownloadContent}
                  disabled={isDownloading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? "Downloading..." : "Download Content"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Content Viewer */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 p-4">
          <div className="flex items-center">
            {type === "pdf" ? (
              <FileText className="mr-2 h-5 w-5 text-purple-400" />
            ) : (
              <Video className="mr-2 h-5 w-5 text-purple-400" />
            )}
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {isPinned && (
              <span className="ml-3 rounded-full bg-green-900/50 px-2 py-0.5 text-xs font-medium text-green-400">
                Saved
              </span>
            )}
          </div>
          <Button variant="outline" size="sm" className="border-slate-700 text-white" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Content Area */}
        <div className="max-h-[70vh] overflow-auto p-6">
          {isLoading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-purple-500" />
              <p className="text-white">Loading content...</p>
            </div>
          ) : isPinning ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-purple-500" />
              <p className="text-white">Saving content...</p>
              <p className="mt-2 text-sm text-slate-400">This may take a moment</p>
            </div>
          ) : isDownloading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-purple-500" />
              <p className="text-white">Downloading from IPFS...</p>
              <p className="mt-2 text-sm text-slate-400">This may take a moment depending on network conditions</p>
            </div>
          ) : error ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-red-800 bg-black/50 p-8 backdrop-blur-sm">
              <p className="text-center text-red-400">{error}</p>
              <Button 
                className="mt-4 bg-purple-600 hover:bg-purple-700"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : showInternalViewer ? (
            renderInternalViewer()
          ) : (
            <div className="prose prose-invert max-w-none">
              {!isValidIpfs && contentHash.startsWith("ipfs://") && (
                <div className="mb-6 rounded-lg border border-yellow-600 bg-yellow-950/30 p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="mr-3 h-5 w-5 flex-shrink-0 text-yellow-500" />
                    <div>
                      <h3 className="text-lg font-medium text-yellow-400">Content Access Issue</h3>
                      <p className="mt-1 text-sm text-yellow-300">
                        There may be an issue accessing this content through external services.
                        Please use the "View in LearnEX Viewer" button below to access this content.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <pre className="rounded-lg bg-slate-800 p-4 text-sm text-slate-300 whitespace-pre-wrap">
                {content}
              </pre>
              
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleViewInternally}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View in LearnEX Viewer
                  </Button>
                  
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleDownloadContent}
                    disabled={isDownloading}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading ? "Downloading..." : "Download Content"}
                  </Button>
                  
                  {contentHash.startsWith("ipfs://") && (
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handlePinContent}
                      disabled={isPinned || isPinning}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isPinned ? "Saved" : isPinning ? "Saving..." : "Save for Offline"}
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="mt-6 rounded-lg bg-slate-800 p-4">
                <h3 className="mb-2 text-lg font-medium text-white">About LearnEX Content</h3>
                <p className="text-sm text-slate-300">
                  LearnEX provides secure access to educational content through our distributed storage system.
                  All content is verified and accessible only to authorized users who have purchased the materials.
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  When you save content for offline access:
                </p>
                <ul className="mt-1 list-disc pl-5 text-sm text-slate-300">
                  <li>The content is stored securely in our distributed network</li>
                  <li>It remains accessible even if you're temporarily offline</li>
                  <li>You can access it from any device with your account</li>
                  <li>Our system ensures the content remains available long-term</li>
                </ul>
                <p className="mt-2 text-sm text-slate-400">
                  By saving content you've purchased, you ensure it remains accessible to you in the future.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 