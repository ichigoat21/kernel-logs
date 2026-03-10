import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import loginRouter from "./routes/admin"
import postRouter from "./routes/post"

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", loginRouter)   // POST /api/auth/login
app.use("/api/posts", postRouter)   // GET  /api/posts

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ ok: true }))

// ─── Start ────────────────────────────────────────────────────────────────────
async function start() {
  try {
    const dbUrl = process.env.DB_URL
    if (!dbUrl) throw new Error("DB_URL environment variable is not set")

    await mongoose.connect(dbUrl)
    console.log("✅ DB connected")

    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
  } catch (e) {
    console.error("❌ Failed to start:", e)
    process.exit(1)
  }
}

start()