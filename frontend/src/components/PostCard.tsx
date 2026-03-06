import type { MouseEvent } from "react"
import type { PostCardProps } from "../types"
import { Icon, Badge, DraftPill, MetaRow } from "./ui"

export function PostCard({ post, isAdmin, onRead, onEdit, onDelete, style }: PostCardProps) {
  return (
    <div className="card" onClick={() => onRead(post)} style={style}>
      <div className="card-inner">
        <div className="card-body">
          <div className="card-badges">
            <Badge category={post.category} />
            {post.status === "draft" && <DraftPill />}
          </div>
          <p className="card-title">{post.title}</p>
          <p className="card-excerpt">{post.excerpt}</p>
          <MetaRow author={post.author} date={post.date} readTime={post.readTime} />
        </div>

        <div
          className="card-actions"
          onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          <button onClick={() => onRead(post)} className="action-btn" title="Read">
            <Icon name="eye" size={14} />
          </button>

          {isAdmin && (
            <>
              <button onClick={() => onEdit(post)} className="action-btn edit" title="Edit">
                <Icon name="edit" size={14} />
              </button>
              <button onClick={() => onDelete(post)} className="action-btn del" title="Delete">
                <Icon name="trash" size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
