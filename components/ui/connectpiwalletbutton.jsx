"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

type Props = {
  username?: string
}

export function ConnectPiWalletButton({ username }: Props) {
  const [loading, setLoading] = useState(false)
  const [connectedUser, setConnectedUser] = useState<string | null>(username || null)

  const connectPiWallet = async () => {
    try {
      setLoading(true)
      const scopes = ['username']
      const result = await Pi.authenticate(scopes, onIncompletePaymentFound)
      setConnectedUser(result.user.username)
      // Save to context/store if needed
    } catch (error) {
      console.error("Pi Wallet connection failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={connectPiWallet}
      disabled={loading || !!connectedUser}
      className="group w-full relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-3 text-white font-semibold shadow-md transition duration-200 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <Wallet className="w-5 h-5 transition-transform group-hover:scale-110" />
      <span className="text-base">
        {loading ? "Connecting..." : connectedUser ? `Connected: @${connectedUser}` : "Connect Pi Wallet"}
      </span>
    </Button>
  )
}
