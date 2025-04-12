import { Route, Routes } from "react-router-dom"
// import { WebSocketProvider } from "./context/useWebSocket"
import { Layout } from "./components/Layout"
import { Home } from "./pages/Home"
import "./App.css"

function App() {
  return (
    // <WebSocketProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
      </Routes>
    // </WebSocketProvider>
  )
}

export default App
