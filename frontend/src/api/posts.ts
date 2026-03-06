import type { Post, PostFormData } from "../types"

const BASE = import.meta.env.VITE_API_URL ?? ""

// ─── Helpers ──────────────────────────────────────────────────────────────────

function authHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization:  `Bearer ${token}`,
  }
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, init)

  if (res.status === 401) {
    localStorage.removeItem("kernelogs_token")
    throw new Error("SESSION_EXPIRED")
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string }
    throw new Error(body.message ?? `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const api = {
  /** Public */
  getPosts: (): Promise<Post[]> =>
    request<Post[]>(`${BASE}/api/posts`),

  /** Admin — token required */
  createPost: (data: PostFormData, token: string): Promise<Post> =>
    request<Post>(`${BASE}/api/posts/add`, {
      method:  "POST",
      headers: authHeaders(token),
      body:    JSON.stringify(data),
    }),

  updatePost: (id: string, data: Partial<PostFormData>, token: string): Promise<Post> =>
    request<Post>(`${BASE}/api/posts/${id}`, {
      method:  "PUT",
      headers: authHeaders(token),
      body:    JSON.stringify(data),
    }),

  deletePost: (id: string, token: string): Promise<void> =>
    request<void>(`${BASE}/api/posts/${id}`, {
      method:  "DELETE",
      headers: authHeaders(token),
    }),
} as const
