import { Route, Routes } from "react-router-dom"
import { WebSocketProvider } from "./context/useWebSocket"
import { Layout } from "./components/Layout"
import { Home } from "./pages/Home"
import { BinanceSpot } from "./pages/Binance/Spot"
import { BinanceAnnouncement } from "./pages/Binance/Announcement"
import { DexNewListing } from "./pages/Dex/NewListing"
import { DexLegitimate } from "./pages/Dex/Legitimate"
import { TrendingCoin } from "./pages/TrendingCoin"
import "./App.css"

function App() {
  return (
    <WebSocketProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/trending"
          element={
            <Layout>
              <TrendingCoin />
            </Layout>
          }
        />
        <Route
          path="/binance/spot"
          element={
            <Layout>
              <BinanceSpot />
            </Layout>
          }
        />
        <Route
          path="/binance/announcement"
          element={
            <Layout>
              <BinanceAnnouncement />
            </Layout>
          }
        />
        <Route
          path="/dex/newListing"
          element={
            <Layout>
              <DexNewListing />
            </Layout>
          }
        />
        <Route
          path="/dex/legitimate"
          element={
            <Layout>
              <DexLegitimate />
            </Layout>
          }
        />
      </Routes>
    </WebSocketProvider>
  )
}

export default App
