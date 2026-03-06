import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import type { Post } from "../types"
import { api } from "../api/posts"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { CATEGORIES } from "../constants"
import { PostCard } from "../components/PostCard"
import { ReadModal } from "../components/modals/ReadModal"
import { EditModal } from "../components/modals/EditModal"
import { DeleteModal } from "../components/modals/DeleteModal"
import { Icon } from "../components/ui"

// ─── Discriminated union for editPost state ───────────────────────────────────
// "new"  = empty form   (null post prop)
// Post   = edit form    (post prop populated)
// closed = modal hidden (null)
type EditTarget = { mode: "new" } | { mode: "edit"; post: Post } | null

// ─── Admin Navbar ─────────────────────────────────────────────────────────────

interface AdminNavbarProps {
  onNewPost: () => void
}

function AdminNavbar({ onNewPost }: AdminNavbarProps) {
  const { dark, toggleDark } = useTheme()
  const { logout }           = useAuth()
  const navigate             = useNavigate()

  const handleLogout = (): void => {
    logout()
    navigate("/", { replace: true })
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="logo">
          <div className="logo-icon">K</div>
          <span className="logo-text">kernelogs</span>
          <span className="admin-nav-badge">admin</span>
        </div>

        <div className="nav-actions">
          <button onClick={toggleDark} className="btn-icon" aria-label="Toggle theme">
            <Icon name={dark ? "sun" : "moon"} size={16} />
          </button>

          <button onClick={onNewPost} className="btn-new" type="button">
            <Icon name="plus" size={12} /> New post
          </button>

          <button onClick={handleLogout} className="btn-logout" title="Sign out" type="button">
            <Icon name="close" size={14} />
          </button>
        </div>
      </div>
    </header>
  )
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [posts,          setPosts]          = useState<Post[]>([])
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState("")
  const [search,         setSearch]         = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [readPost,       setReadPost]       = useState<Post | null>(null)
  const [editTarget,     setEditTarget]     = useState<EditTarget>(null)
  const [deletePost,     setDeletePost]     = useState<Post | null>(null)

  const loadPosts = useCallback((): void => {
    setLoading(true)
    setError("")
    api.getPosts()
      .then(setPosts)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load posts.")
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(loadPosts, [loadPosts])

  // ─── Derived ───────────────────────────────────────────────────────────────
  const filtered = posts.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory
    const q = search.toLowerCase()
    return matchCat && (
      !q || [p.title, p.author, p.excerpt].some(s => s.toLowerCase().includes(q))
    )
  })

  const published  = posts.filter(p => p.status === "published").length
  const drafts     = posts.filter(p => p.status === "draft").length
  const categories = new Set(posts.map(p => p.category)).size
  const authors    = new Set(posts.map(p => p.author)).size

  const stats: Array<[string, number]> = [
    ["Published",  published],
    ["Drafts",     drafts],
    ["Categories", categories],
    ["Authors",    authors],
  ]

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = (result: Post, isNew: boolean): void => {
    setPosts(prev =>
      isNew
        ? [result, ...prev]
        : prev.map(p => p.id === result.id ? { ...p, ...result } : p)
    )
    setEditTarget(null)
  }

  const handleDelete = (id: string): void => {
    setPosts(prev => prev.filter(p => p.id !== id))
    setDeletePost(null)
  }

  const openNewPost  = (): void => setEditTarget({ mode: "new" })
  const openEditPost = (post: Post): void => setEditTarget({ mode: "edit", post })

  // Derive the Post | null for EditModal from the discriminated union
  const editModalPost: Post | null =
    editTarget?.mode === "edit" ? editTarget.post : null

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <AdminNavbar onNewPost={openNewPost} />

      <main className="main">
        <div className="heading-block">
          <h1>Journal</h1>
          <p>{published} published · {drafts} drafts</p>
        </div>

        <div className="admin-banner" style={{ marginBottom: "1.5rem" }}>
          <span className="admin-dot" />
          Admin mode — hover any post to edit or delete it.
        </div>

        <div className="search-filter">
          <div className="search-wrap">
            <span className="search-icon"><Icon name="search" size={15} /></span>
            <input
              type="text"
              placeholder="Search posts…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
              aria-label="Search posts"
            />
          </div>
          <div className="cats">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cat-btn${activeCategory === cat ? " active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="empty">
            <Icon name="file" size={28} />
            <p>Loading posts…</p>
          </div>
        ) : error ? (
          <div className="empty">
            <span style={{ fontSize: "2rem", opacity: 0.4 }}>⚠</span>
            <p>{error}</p>
            <button className="cat-btn" style={{ marginTop: "0.5rem" }} onClick={loadPosts}>
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <span style={{ fontSize: "2.5rem", opacity: 0.3 }}>◌</span>
            <p>
              No posts found.{" "}
              <button
                className="btn-new"
                style={{ display: "inline-flex", marginTop: "0.5rem" }}
                onClick={openNewPost}
                type="button"
              >
                Create one
              </button>
            </p>
          </div>
        ) : (
          <div className="cards">
            {filtered.map((post, i) => (
              <PostCard
                key={post.id}
                post={post}
                isAdmin={true}
                onRead={setReadPost}
                onEdit={openEditPost}
                onDelete={setDeletePost}
                style={{ animation: `fadeUp .3s ease ${i * 40}ms both` }}
              />
            ))}
          </div>
        )}

        {posts.length > 0 && (
          <div className="stats">
            {stats.map(([label, val]) => (
              <span key={label} className="stat">
                <strong>{val}</strong> {label}
              </span>
            ))}
          </div>
        )}
      </main>

      {readPost !== null && (
        <ReadModal post={readPost} onClose={() => setReadPost(null)} />
      )}

      {editTarget !== null && (
        <EditModal
          post={editModalPost}
          onClose={() => setEditTarget(null)}
          onSave={handleSave}
        />
      )}

      {deletePost !== null && (
        <DeleteModal
          post={deletePost}
          onClose={() => setDeletePost(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  )
}
