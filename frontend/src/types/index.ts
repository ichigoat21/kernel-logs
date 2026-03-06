import type { CSSProperties } from "react"
import type { ICON_PATHS } from "../constants"

// ─── Domain Types ─────────────────────────────────────────────────────────────

export type PostStatus   = "published" | "draft"
export type PostCategory = "Media" | "Personal" | "Tech" | "Deepshit"

export interface Post {
  id:       string
  title:    string
  excerpt:  string
  content:  string
  category: PostCategory
  status:   PostStatus
  author:   string
  date:     string
  readTime: string
}

export type PostFormData = Omit<Post, "id" | "author" | "date" | "readTime">

// ─── Context Types ────────────────────────────────────────────────────────────

export interface ThemeContextValue {
  dark:       boolean
  toggleDark: () => void
}

export interface AuthContextValue {
  isAdmin: boolean
  token:   string | null
  login:   (password: string) => Promise<void>
  logout:  () => void
}

// ─── Component Prop Types ─────────────────────────────────────────────────────

export interface IconProps {
  name:  keyof typeof ICON_PATHS
  size?: number
}

export interface BadgeProps {
  category: PostCategory | string
}

export interface MetaRowProps {
  author:   string
  date:     string
  readTime: string
}

export interface PostCardProps {
  post:     Post
  isAdmin:  boolean
  onRead:   (post: Post) => void
  /** Only called when isAdmin is true — safe to pass a noop for reader mode */
  onEdit:   (post: Post) => void
  /** Only called when isAdmin is true — safe to pass a noop for reader mode */
  onDelete: (post: Post) => void
  style?:   CSSProperties
}

export interface ReadModalProps {
  post:    Post
  onClose: () => void
}

export interface EditModalProps {
  post:    Post | null
  onClose: () => void
  onSave:  (result: Post, isNew: boolean) => void
}

export interface DeleteModalProps {
  post:      Post
  onClose:   () => void
  onConfirm: (id: string) => void
}

export interface OverlayProps {
  onClick: () => void
}
