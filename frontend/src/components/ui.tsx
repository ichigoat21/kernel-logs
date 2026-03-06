import type { BadgeProps, MetaRowProps, OverlayProps, IconProps } from "../types"
import { ICON_PATHS, BADGE_CLASS } from "../constants"

// ─── Icon ─────────────────────────────────────────────────────────────────────

export function Icon({ name, size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

// ─── SmallIcon ────────────────────────────────────────────────────────────────

interface SmallIconProps {
  d:     string
  size?: number
}

export function SmallIcon({ d, size = 11 }: SmallIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

export function Badge({ category }: BadgeProps) {
  const cls = BADGE_CLASS[category as keyof typeof BADGE_CLASS] ?? "badge badge-default"
  return <span className={cls}>{category}</span>
}

// ─── DraftPill ────────────────────────────────────────────────────────────────

export function DraftPill() {
  return <span className="badge-draft">Draft</span>
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

export function Overlay({ onClick }: OverlayProps) {
  return <div className="modal-overlay" onClick={onClick} />
}

// ─── MetaRow ──────────────────────────────────────────────────────────────────

interface MetaItem {
  path:  string | null
  value: string
}

export function MetaRow({ author, date, readTime }: MetaRowProps) {
  const items: MetaItem[] = [
    { path: ICON_PATHS.user,  value: author },
    { path: null,             value: date },
    { path: ICON_PATHS.clock, value: readTime },
  ].filter(item => item.value.length > 0)

  return (
    <div className="card-meta">
      {items.map((item, i) => (
        <span key={i} className="meta-item">
          {item.path !== null && <SmallIcon d={item.path} />}
          {item.value}
        </span>
      ))}
    </div>
  )
}
