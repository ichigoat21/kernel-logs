import mongoose, { Schema, Document } from "mongoose"

// ─── Interface (matches frontend Post type exactly) ────────────────────────────
export interface IPost extends Document {
  title:    string
  excerpt:  string
  content:  string
  category: "Tech" | "Media" | "Personal" | "Deepshit"
  status:   "published" | "draft"
  author:   string
  date:     string
  readTime: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const postSchema = new Schema<IPost>(
  {
    title:    { type: String, required: true, trim: true },
    excerpt:  { type: String, default: "" },
    content:  { type: String, default: "" },
    category: {
      type: String,
      enum: ["Tech", "Media", "Personal", "Deepshit"],
      default: "Media",
    },
    status:   { type: String, enum: ["published", "draft"], default: "draft" },
    author:   { type: String, default: "Admin" },
    date:     { type: String },
    readTime: { type: String },
  },
  { timestamps: true }
)

// ─── Pre-save: auto-fill date + readTime ──────────────────────────────────────
postSchema.pre("save", function (next) {
  if (!this.date) {
    this.date = formatDate(new Date())
  }
  this.readTime = estimateReadTime(this.content ?? "")
  next()
})

// ─── Pre-findByIdAndUpdate: recalculate readTime on content change ─────────────
postSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as { $set?: { content?: string } }
  const content = update?.$set?.content
  if (content !== undefined) {
    this.set({ "readTime": estimateReadTime(content) })
  }
  next()
})

// ─── Transform _id → id for the frontend ─────────────────────────────────────
postSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

export default mongoose.model<IPost>("Post", postSchema)