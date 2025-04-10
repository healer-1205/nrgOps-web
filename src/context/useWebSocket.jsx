import React, { useContext, createContext, useState, useEffect } from "react"

const WebSocketContext = createContext()

export function WebSocketProvider({ children }) {
  const socket = useWebSocketProvider() // Custom hook to manage WebSocket logic

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  )
}

// Custom hook to access WebSocket data
export const useWebSocket = () => {
  return useContext(WebSocketContext)
}

// Custom hook to handle WebSocket connection
function useWebSocketProvider() {
  const [binanceListings, setBinanceListings] = useState([])
  const [dexListings, setDexListings] = useState([])

  // Request permission for browser notifications
  if (Notification.permission !== "granted") {
    Notification.requestPermission()
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")

    ws.onopen = () => {
      console.log("Connected to WebSocket server")
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      // Show a notification if there's a new announcement
      if (message.type === "binanceListing") {
        if (Notification.permission === "granted") {
          new Notification("New Announcement!", {
            body:
              message.data[0]?.title ||
              "A new cryptocurrency listing is available! Check Binance announcements.",
            icon: "http://localhost:5173/logo.png", // Optional: Set a custom icon
            requireInteraction: true,
          })
        }
        setBinanceListings(() => message.data)
      } else {
        setDexListings(() => message.data)
      }
    }

    // ws.onerror = (error) => {
    //   console.error("WebSocket Error:", error)
    // }

    ws.onclose = () => {
      console.log("WebSocket Disconnected. Attempting to reconnect...")
    }

    return () => {
      ws.close()
    }
  }, [])

  return { binanceListings, dexListings }
}
