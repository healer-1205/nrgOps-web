import { Route, Routes } from "react-router-dom"
import { Layout } from "./components/Layout"
import { Dashboard } from "./pages/Dashboard"
import { Plugins } from "./pages/Plugins"
import "./App.css"

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/plugins"
        element={
          <Layout>
            <Plugins />
          </Layout>
        }
      />
    </Routes>
  )
}

export default App
