import { useRef, useState } from "react"
import type { DeleteModalProps } from "../../types"
import { useClickOutside } from "../../hooks"
import { useAuth } from "../../context/AuthContext"
import { api } from "../../api/posts"
import { Icon, Overlay } from "../ui"

export function DeleteModal({ post, onClose, onConfirm }: DeleteModalProps) {
  const ref       = useRef<HTMLDivElement>(null)
  const { token } = useAuth()

  const [deleting, setDeleting] = useState(false)
  const [error,    setError]    = useState("")

  useClickOutside(ref, onClose)

  const handleDelete = async (): Promise<void> => {
    if (!token) {
      setError("Session expired — please log in again.")
      return
    }

    setDeleting(true)

    try {
      await api.deletePost(post.id, token)
      onConfirm(post.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.")
      setDeleting(false)
    }
  }

  return (
    <div className="modal-backdrop" style={{ animationDuration: ".15s" }}>
      <Overlay onClick={onClose} />
      <div ref={ref} className="modal-box del-box">
        <div className="del-icon">
          <Icon name="trash" size={18} />
        </div>

        <p className="del-title">Delete post?</p>
        <p className="del-desc">
          "<em>{post.title}</em>" will be permanently removed.
        </p>

        {error && <p className="field-error" style={{ marginBottom: "1rem" }}>{error}</p>}

        <div className="del-actions">
          <button onClick={onClose} className="btn-del-cancel">
            Cancel
          </button>
          <button
            onClick={() => { void handleDelete() }}
            disabled={deleting}
            className="btn-del-confirm"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}
