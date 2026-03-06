import { useRef } from "react"
import type { ReadModalProps } from "../../types"
import { useClickOutside, useLockBody } from "../../hooks"
import { ICON_PATHS } from "../../constants"
import { Icon, Badge, DraftPill, Overlay, SmallIcon } from "../ui"

interface MetaItem {
  path:  string | null
  value: string
}

export function ReadModal({ post, onClose }: ReadModalProps) {
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, onClose)
  useLockBody()

  const metaItems: MetaItem[] = [
    { path: ICON_PATHS.user,  value: post.author },
    { path: null,             value: post.date },
    { path: ICON_PATHS.clock, value: post.readTime },
  ].filter(item => item.value.length > 0)

  return (
    <div className="modal-backdrop">
      <Overlay onClick={onClose} />
      <div
        ref={ref}
        className="modal-box"
        style={{ maxWidth: "42rem", maxHeight: "88vh", display: "flex", flexDirection: "column" }}
      >
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="card-badges" style={{ marginBottom: "0.75rem" }}>
              <Badge category={post.category} />
              {post.status === "draft" && <DraftPill />}
            </div>
            <h2 className="modal-title">{post.title}</h2>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close">
            <Icon name="close" size={15} />
          </button>
        </div>

        <div className="modal-meta">
          {metaItems.map((item, i) => (
            <span key={i} className="meta-item">
              {item.path !== null && <SmallIcon d={item.path} />}
              {item.value}
            </span>
          ))}
        </div>

        <div className="modal-body">
          <p className="excerpt">{post.excerpt}</p>
          {post.content
            ? post.content.split("\n\n").map((para, i) => <p key={i}>{para}</p>)
            : <p className="no-content">No content yet.</p>
          }
        </div>
      </div>
    </div>
  )
}
