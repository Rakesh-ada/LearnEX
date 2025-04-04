"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { getProfileImage } from "./navbar"
import { toast } from "@/hooks/use-toast"

interface WalletButtonProps {
  isMobile?: boolean
  showOptions?: boolean
  fullWidth?: boolean
  variant?: "ghost" | "default" | "outline" | "secondary" | "destructive" | "gradient"
}

export default function WalletButton({ 
  isMobile = false, 
  showOptions = false,
  fullWidth = false,
  variant = "ghost"
}: WalletButtonProps) {
  const { currentAccount, connect, isConnecting } = useWallet()
  const [hasMetaMask, setHasMetaMask] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [showMetaMaskInfo, setShowMetaMaskInfo] = useState(false)

  // Detect mobile device and MetaMask on component mount
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    };
    
    const checkMetaMask = () => {
      return typeof window !== 'undefined' && 
        typeof window.ethereum !== 'undefined' && 
        (window.ethereum.isMetaMask || false);
    };
    
    setIsMobileDevice(checkMobile());
    setHasMetaMask(checkMetaMask());
  }, []);

  const handleConnect = async () => {
    try {
      // If MetaMask isn't installed, show installation options
      if (!hasMetaMask) {
        setShowMetaMaskInfo(true);
        return;
      }
      
      // If MetaMask is installed, proceed with connection
      await connect()
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect your wallet. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleInstallMetaMask = () => {
    if (isMobileDevice) {
      // Check if on Android or iOS
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isAndroid = /android/i.test(userAgent.toLowerCase());
      
      if (isAndroid) {
        // Redirect to Google Play Store for MetaMask
        window.location.href = "https://play.google.com/store/apps/details?id=io.metamask";
      } else {
        // Redirect to App Store for MetaMask
        window.location.href = "https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202";
      }
    } else {
      // Redirect to MetaMask website for browser extension
      window.open("https://metamask.io/download/", "_blank");
      toast({
        title: "MetaMask Required",
        description: "Please install the MetaMask extension and refresh this page.",
      });
    }
  }

  if (currentAccount) {
    return (
      <Button
        variant={variant}
        className={`flex items-center ${isMobile || fullWidth ? "w-full" : ""} px-3 border border-transparent hover:border-slate-700 hover:bg-slate-900/50`}
      >
        <div className="flex items-center justify-between w-full gap-3">
          <span className="truncate">{`${currentAccount.substring(0, 6)}...${currentAccount.substring(currentAccount.length - 4)}`}</span>
          <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-700 flex-shrink-0">
            <div style={getProfileImage(currentAccount)}></div>
          </div>
        </div>
      </Button>
    )
  }

  if (showMetaMaskInfo && !hasMetaMask) {
    return (
      <div className={`${isMobile || fullWidth ? "w-full" : ""} space-y-2`}>
        <Button
          variant="gradient"
          className={`${isMobile || fullWidth ? "w-full" : ""} bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700`}
          onClick={handleInstallMetaMask}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {`Install MetaMask${isMobileDevice ? " App" : ""}`}
        </Button>
        
        {showOptions && (
          <div className="rounded-md bg-slate-800/70 p-3 text-xs text-slate-300">
            <p className="mb-1">
              {isMobileDevice
                ? "You'll be redirected to the app store to install MetaMask."
                : "You'll be redirected to the MetaMask website to install the browser extension."}
            </p>
            <p>After installation, please return to this page and refresh.</p>
            
            <Button
              variant="link"
              size="sm"
              className="mt-2 p-0 h-auto text-purple-400 hover:text-purple-300"
              onClick={() => setShowMetaMaskInfo(false)}
            >
              Back to connect options
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <Button
      variant={variant}
      className={`${isMobile || fullWidth ? "w-full" : ""} ${variant === "ghost" ? "px-3 border border-violet-500/30 bg-violet-500/10 text-violet-100 hover:bg-violet-500/20 hover:border-violet-500/50" : ""}`}
      onClick={handleConnect}
      disabled={isConnecting}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}

