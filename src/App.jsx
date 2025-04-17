import { Route, Routes } from "react-router-dom"
import { Layout } from "./components/Layout"
import { Dashboard } from "./pages/Dashboard"
import { Agent } from "./pages/Agent"
import { Database } from "./pages/Database"
import { Plugins } from "./pages/Plugins"
import { Setting } from "./pages/Setting"
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
        path="/agent"
        element={
          <Layout>
            <Agent />
          </Layout>
        }
      />
      <Route
        path="/database"
        element={
          <Layout>
            <Database />
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
      <Route
        path="/setting"
        element={
          <Layout>
            <Setting />
          </Layout>
        }
      />
    </Routes>
  )
}

export default App
