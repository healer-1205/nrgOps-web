import { Route, Routes } from "react-router-dom"
import { PrivateRoute } from "./components/Router/PrivateRoute"
import { Signin } from "./pages/Signin"
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
      <Route path="/signin" element={<Signin />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/agent"
        element={
          <PrivateRoute>
            <Layout>
              <Agent />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/database"
        element={
          <PrivateRoute>
            <Layout>
              <Database />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/plugins"
        element={
          <PrivateRoute>
            <Layout>
              <Plugins />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/setting"
        element={
          <PrivateRoute>
            <Layout>
              <Setting />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
