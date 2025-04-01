"use client"

import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { getProfileImage } from "./navbar"

interface WalletButtonProps {
  isMobile?: boolean
}

export default function WalletButton({ isMobile = false }: WalletButtonProps) {
  const { currentAccount, connect, isConnecting } = useWallet()

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  if (currentAccount) {
    return (
      <Button
        variant="ghost"
        className={`flex items-center ${isMobile ? "w-full" : ""} px-3 border border-transparent hover:border-slate-700 hover:bg-slate-900/50`}
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

  return (
    <Button
      variant="ghost"
      className={`${isMobile ? "w-full" : ""} px-3 border border-violet-500/30 bg-violet-500/10 text-violet-100 hover:bg-violet-500/20 hover:border-violet-500/50`}
      onClick={handleConnect}
      disabled={isConnecting}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}

