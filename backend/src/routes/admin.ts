import { Router } from "express"
import jwt from "jsonwebtoken"

const loginRouter = Router()

loginRouter.post("/login", (req, res) => {
  try {
    
    const { password } = req.body

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      res.status(403).json({ message: "Unauthorized" })
      return
    }

    const token = jwt.sign(
      { role: "admin" },
      process.env.ADMIN_PASSWORD!,
      { expiresIn: "8h" }  
    )

    res.status(200).json({ token })
  } catch (e) {
    res.status(500).json({ message: `Sorry there was an error: ${e}` })
  }
})

export default loginRouter