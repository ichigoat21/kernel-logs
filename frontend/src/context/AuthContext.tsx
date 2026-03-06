import { createContext, useContext, useState, useCallback } from "react"
import type { ReactNode } from "react"
import type { AuthContextValue } from "../types"

const TOKEN_KEY = "kernelogs_token"

// ─── JWT helpers ──────────────────────────────────────────────────────────────

interface JwtPayload {
  role?: string
  exp?:  number
}

function parsePayload(token: string): JwtPayload | null {
  try {
    return JSON.parse(atob(token.split(".")[1])) as JwtPayload
  } catch {
    return null
  }
}

function decodeRole(token: string): string | null {
  return parsePayload(token)?.role ?? null
}

function isTokenExpired(token: string): boolean {
  const payload = parsePayload(token)
  if (!payload?.exp) return false
  return payload.exp * 1000 < Date.now()
}

function getStoredToken(): string | null {
  const t = localStorage.getItem(TOKEN_KEY)
  if (!t) return null
  if (isTokenExpired(t)) {
    localStorage.removeItem(TOKEN_KEY)
    return null
  }
  return t
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue>({
  isAdmin: false,
  token:   null,
  login:   async () => {},
  logout:  () => {},
})

export const useAuth = (): AuthContextValue => useContext(AuthContext)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken())

  const isAdmin = token !== null && decodeRole(token) === "admin"

  const login = useCallback(async (password: string): Promise<void> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ password }),
    })

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string }
      throw new Error(body.message ?? "Login failed")
    }

    const data = (await res.json()) as { token: string }
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
  }, [])

  const logout = useCallback((): void => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ isAdmin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
