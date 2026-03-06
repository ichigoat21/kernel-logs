import type { PostCategory } from "../types"

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES: string[] = ["All", "Media", "Personal", "Tech", "Deepshit"]

export const POST_CATEGORIES: PostCategory[] = ["Media", "Personal", "Tech", "Deepshit"]

// ─── Badge class map ──────────────────────────────────────────────────────────

export const BADGE_CLASS: Record<PostCategory, string> = {
  Media:    "badge badge-Media",
  Personal: "badge badge-Personal",
  Tech:     "badge badge-Tech",
  Deepshit: "badge badge-Deepshit",
}

// ─── Icon SVG paths ───────────────────────────────────────────────────────────

export const ICON_PATHS = {
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  edit:   "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:  "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  sun:    "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z",
  moon:   "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  close:  "M18 6L6 18M6 6l12 12",
  plus:   "M12 5v14M5 12h14",
  check:  "M20 6L9 17l-5-5",
  eye:    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  clock:  "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  user:   "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  file:   "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
} as const

export type IconName = keyof typeof ICON_PATHS
