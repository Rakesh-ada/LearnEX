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
        variant="outline"
        className={`relative border-purple-500 bg-black text-white ${isMobile ? "w-full" : ""} pr-2`}
      >
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 opacity-20 blur-sm"></div>
        <span className="truncate">{`${currentAccount.substring(0, 6)}...${currentAccount.substring(currentAccount.length - 4)}`}</span>
        <div className="ml-2 h-6 w-6 overflow-hidden rounded-full border border-slate-700">
          <div style={getProfileImage(currentAccount)}></div>
        </div>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className={`relative border-purple-500 bg-black text-white ${isMobile ? "w-full" : ""}`}
      onClick={handleConnect}
      disabled={isConnecting}
    >
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 opacity-20 blur-sm"></div>
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}

