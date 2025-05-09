import { Route, Routes } from "react-router-dom"
import { PrivateRoute } from "./components/Router/PrivateRoute"
import { Signin } from "./pages/Signin"
import { Signup } from "./pages/Signup"
import { Layout } from "./components/Layout"
import { Dashboard } from "./pages/Dashboard"
import { Agent } from "./pages/Agent"
import { Database } from "./pages/Database"
import { Plugins } from "./pages/Plugins"
import { CreatePlugin } from "./pages/Plugins/create"
import { Setting } from "./pages/Setting"
import "./App.css"

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
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
        path="/plugins/create"
        element={
          <PrivateRoute>
            <Layout>
              <CreatePlugin />
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
