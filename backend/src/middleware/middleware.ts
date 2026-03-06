import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

// ─── Extend Express Request so req.user is typed everywhere ──────────────────
export interface JwtPayload {
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────
export const Middleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized — no token provided" })
    return
  }

  const parts = authHeader.split(" ")
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ message: "Unauthorized — malformed Authorization header" })
    return
  }

  const token = parts[1]

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_PASSWORD!) as JwtPayload

    if (decoded.role !== "admin") {
      res.status(403).json({ message: "Forbidden — admin role required" })
      return
    }

    req.user = decoded
    next()
  } catch (e) {

    if (e instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired — please log in again" })
    } else {
      res.status(401).json({ message: "Invalid token" })
    }
  }
}