"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { usePiUserStore } from "@/stores/usePiUserStore"

export function ConnectPiWalletButton() {
  const [loading, setLoading] = useState(false)
  const username = usePiUserStore((state) => state.username)
  const setUsername = usePiUserStore((state) => state.setUsername)

  const connectPiWallet = async () => {
    try {
      setLoading(true)
      const scopes = ["username"]
      const result = await Pi.authenticate(scopes, onIncompletePaymentFound)
      setUsername(result.user.username)
    } catch (err) {
      console.error("Failed to connect:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={connectPiWallet}
      disabled={loading || !!username}
      className="group w-full relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-3 text-white font-semibold shadow-md transition duration-200 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <Wallet className="w-5 h-5 transition-transform group-hover:scale-110" />
      <span className="text-base">
        {loading
          ? "Connecting..."
          : username
          ? `Connected: @${username}`
          : "Connect Pi Wallet"}
      </span>
    </Button>
  )
}
