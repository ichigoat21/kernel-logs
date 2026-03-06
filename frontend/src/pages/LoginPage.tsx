import { useState, useRef } from "react"
import type { FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Icon } from "../components/ui"

export default function LoginPage() {
  const { login }            = useAuth()
  const { dark, toggleDark } = useTheme()
  const navigate             = useNavigate()

  const [password, setPassword] = useState("")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")
  const [shake,    setShake]    = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!password.trim()) return

    setLoading(true)
    setError("")

    try {
      await login(password)
      navigate("/admin", { replace: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed"
      const isWrongPassword =
        msg.toLowerCase().includes("unauthorized") ||
        msg.toLowerCase().includes("forbidden")    ||
        msg.toLowerCase().includes("wrong")
      setError(isWrongPassword ? "Wrong password. Try again." : msg)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setPassword("")
      inputRef.current?.focus()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <button
        onClick={toggleDark}
        className="btn-icon login-theme-toggle"
        aria-label="Toggle theme"
        type="button"
      >
        <Icon name={dark ? "sun" : "moon"} size={16} />
      </button>

      <div className={`login-card${shake ? " shake" : ""}`}>
        <Link to="/" className="login-logo" title="Back to journal">
          <div
            className="logo-icon"
            style={{ width: "2.25rem", height: "2.25rem", fontSize: "0.9rem" }}
          >
            K
          </div>
          <span className="logo-text" style={{ fontSize: "1rem" }}>kernelogs</span>
        </Link>

        <h2 className="login-title">Admin sign in</h2>
        <p className="login-sub">This page is not linked publicly.</p>

        <form onSubmit={(e) => { void handleSubmit(e) }} className="login-form" noValidate>
          {error && (
            <div className="login-error" role="alert">
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div className="login-field">
            <label className="field-label" htmlFor="admin-password">Password</label>
            <input
              ref={inputRef}
              id="admin-password"
              type="password"
              className="field-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="login-btn"
          >
            {loading ? <span className="login-spinner" aria-hidden="true" /> : "Sign in"}
          </button>
        </form>

        <p className="login-back">
          <Link to="/" className="login-back-link">← Back to journal</Link>
        </p>
      </div>
    </div>
  )
}
