import type { ReactNode } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Dashboard      from "./pages/Dashboard"
import AdminDashboard from "./pages/AdminDashboard"
import LoginPage      from "./pages/LoginPage"
import "./styles/globals.css"

// ─── Route guards ─────────────────────────────────────────────────────────────

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth()
  return isAdmin ? <>{children}</> : <Navigate to="/admin/login" replace />
}

function GuestRoute({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth()
  return isAdmin ? <Navigate to="/admin" replace /> : <>{children}</>
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="app">
            <Routes>
              <Route path="/" element={<Dashboard />} />

              <Route
                path="/admin/login"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
