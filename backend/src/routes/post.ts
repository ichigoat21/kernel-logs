import { Router } from "express"
import postModel from "../schema/post"
import { Middleware } from "../middleware/middleware"

const postRouter = Router()

// ─── GET all posts (public) ───────────────────────────────────────────────────
postRouter.get("/", async (req, res) => {
  try {
    const posts = await postModel.find().sort({ createdAt: -1 })
    res.status(200).json(posts)
  } catch (e) {
    res.status(500).json({ message: `Sorry there was an error: ${e}` })
  }
})

// ─── GET single post (public) ─────────────────────────────────────────────────
postRouter.get("/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id)
    if (!post) {
      res.status(404).json({ message: "Post not found" })
      return
    }
    res.status(200).json(post)
  } catch (e) {
    res.status(500).json({ message: `Sorry there was an error: ${e}` })
  }
})

// ─── POST create (admin only) ─────────────────────────────────────────────────
postRouter.post("/add", Middleware, async (req, res) => {
  try {
    const { title, excerpt, content, category, status } = req.body

    if (!title) {
      res.status(400).json({ message: "Title is required" })
      return
    }

    const post = await postModel.create({
      title,
      excerpt: excerpt ?? "",
      content: content ?? "",
      category: category ?? "Design",
      status: status ?? "draft",
      // author, date, readTime are set by the schema default / virtual
    })

    res.status(201).json(post)
  } catch (e) {
    res.status(500).json({ message: `Sorry there was an error: ${e}` })
  }
})

// ─── PUT update (admin only) ──────────────────────────────────────────────────
postRouter.put("/:id", Middleware, async (req, res) => {
  try {
    const updatedPost = await postModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )

    if (!updatedPost) {
      res.status(404).json({ message: "Post not found" })
      return
    }

    res.status(200).json(updatedPost)
  } catch (e) {
    res.status(500).json({ message: `Sorry there was an error: ${e}` })
  }
})

// ─── DELETE (admin only) ──────────────────────────────────────────────────────
postRouter.delete("/:id", Middleware, async (req, res) => {
  try {
    const deleted = await postModel.findByIdAndDelete(req.params.id)

    if (!deleted) {
      res.status(404).json({ message: "Post not found" })
      return
    }

    res.status(200).json({ message: "Post deleted successfully" })
  } catch (e) {
    res.status(500).json({ message: `Sorry there was an error: ${e}` })
  }
})

export default postRouter