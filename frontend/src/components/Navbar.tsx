import { useTheme } from "../context/ThemeContext"
import { Icon } from "./ui"

// Pure reader navbar — no admin references, no login link, nothing
export function Navbar() {
  const { dark, toggleDark } = useTheme()

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="logo">
          <div className="logo-icon">K</div>
          <span className="logo-text">kernelogs</span>
        </div>

        <div className="nav-actions">
          <button onClick={toggleDark} className="btn-icon" aria-label="Toggle theme">
            <Icon name={dark ? "sun" : "moon"} size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
