import { useRef, useState } from "react"
import type { ChangeEvent } from "react"
import type { EditModalProps, PostFormData } from "../../types"
import { useClickOutside, useLockBody } from "../../hooks"
import { useAuth } from "../../context/AuthContext"
import { POST_CATEGORIES } from "../../constants"
import { api } from "../../api/posts"
import { Icon, Overlay } from "../ui"

const DEFAULT_FORM: PostFormData = {
  title:    "",
  excerpt:  "",
  content:  "",
  category: "Media",
  status:   "draft",
}

export function EditModal({ post, onClose, onSave }: EditModalProps) {
  const ref       = useRef<HTMLDivElement>(null)
  const { token } = useAuth()

  const [form,   setForm]   = useState<PostFormData>(() =>
    post
      ? { title: post.title, excerpt: post.excerpt, content: post.content, category: post.category, status: post.status }
      : { ...DEFAULT_FORM }
  )
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState("")

  useClickOutside(ref, onClose)
  useLockBody()

  type Field = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

  const set = (key: keyof PostFormData) => (e: Field) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = async (): Promise<void> => {
    if (!form.title.trim()) { setError("Title is required."); return }
    if (!token)             { setError("Session expired — please log in again."); return }

    setError("")
    setSaving(true)

    try {
      const result = post?.id
        ? await api.updatePost(post.id, form, token)
        : await api.createPost(form, token)

      setSaved(true)
      setTimeout(() => onSave(result, !post?.id), 700)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong."
      setError(msg === "SESSION_EXPIRED" ? "Session expired — please log in again." : msg)
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <Overlay onClick={onClose} />
      <div ref={ref} className="modal-box edit-box">

        <div className="edit-header">
          <h3>{post?.id ? "Edit post" : "New post"}</h3>
          <button onClick={onClose} className="btn-icon" aria-label="Close">
            <Icon name="close" size={15} />
          </button>
        </div>

        <div className="edit-fields">
          {error && <p className="field-error">{error}</p>}

          <div>
            <label className="field-label" htmlFor="edit-title">Title</label>
            <input
              id="edit-title"
              className="field-input"
              placeholder="Post title…"
              value={form.title}
              onChange={set("title")}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="edit-excerpt">Excerpt</label>
            <textarea
              id="edit-excerpt"
              className="field-input"
              style={{ resize: "none" }}
              rows={2}
              placeholder="Short summary…"
              value={form.excerpt}
              onChange={set("excerpt")}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="edit-content">Content</label>
            <textarea
              id="edit-content"
              className="field-input"
              style={{ resize: "none" }}
              rows={6}
              placeholder="Write your post…"
              value={form.content}
              onChange={set("content")}
            />
          </div>

          <div className="field-row">
            <div className="field-wrap">
              <label className="field-label" htmlFor="edit-category">Category</label>
              <select
                id="edit-category"
                className="field-input"
                style={{ cursor: "pointer" }}
                value={form.category}
                onChange={set("category")}
              >
                {POST_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field-wrap">
              <label className="field-label" htmlFor="edit-status">Status</label>
              <select
                id="edit-status"
                className="field-input"
                style={{ cursor: "pointer" }}
                value={form.status}
                onChange={set("status")}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>

        <div className="edit-footer">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button
            onClick={() => { void handleSave() }}
            disabled={saving || saved}
            className={`btn-save${saved ? " saved" : ""}`}
          >
            {saved
              ? <><Icon name="check" size={13} /> Saved</>
              : saving
                ? "Saving…"
                : post?.id ? "Save changes" : "Publish"
            }
          </button>
        </div>
      </div>
    </div>
  )
}
