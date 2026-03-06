import { useState, useEffect, useCallback } from "react"
import type { Post } from "../types"
import { api } from "../api/posts"
import { CATEGORIES } from "../constants"
import { Navbar } from "../components/Navbar"
import { PostCard } from "../components/PostCard"
import { ReadModal } from "../components/modals/ReadModal"
import { Icon } from "../components/ui"

// ─── Noop handlers — PostCard requires onEdit/onDelete even in reader mode ────
const noop = (_post: Post): void => { /* reader mode — no-op */ }

export default function Dashboard() {
  const [posts,          setPosts]          = useState<Post[]>([])
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState("")
  const [search,         setSearch]         = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [readPost,       setReadPost]       = useState<Post | null>(null)

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

  return (
    <>
      <Navbar />

      <main className="main">
        <div className="heading-block">
          <h1>Journal</h1>
          <p>{published} published · {drafts} drafts</p>
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
            <p>No posts found.</p>
          </div>
        ) : (
          <div className="cards">
            {filtered.map((post, i) => (
              <PostCard
                key={post.id}
                post={post}
                isAdmin={false}
                onRead={setReadPost}
                onEdit={noop}
                onDelete={noop}
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
    </>
  )
}
