"use client"

import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

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
        className={`relative border-purple-500 bg-black text-white ${isMobile ? "w-full" : ""}`}
      >
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 opacity-20 blur-sm"></div>
        <Wallet className="mr-2 h-4 w-4" />
        <span className="truncate">{`${currentAccount.substring(0, 6)}...${currentAccount.substring(currentAccount.length - 4)}`}</span>
      </Button>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`relative bg-gradient-to-r from-purple-500 to-blue-500 text-white ${isMobile ? "w-full" : ""}`}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}

