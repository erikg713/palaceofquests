import React, { useEffect, useState } from 'react'
import { PiNetwork } from '../piClient'

export default function PiWalletLogin({ onLogin }) {
  const [username, setUsername] = useState(null)

  const handleLogin = async () => {
    try {
      const scopes = ['username', 'payments']
      const user = await PiNetwork.authenticate(scopes)
      setUsername(user.username)
      onLogin(user)
    } catch (error) {
      console.error('Pi Auth Error:', error)
    }
  }

  return (
    <div>
      {username ? (
        <p>Welcome, {username}!</p>
      ) : (
        <button onClick={handleLogin} className="btn">Login with Pi</button>
      )}
    </div>
  )
}
