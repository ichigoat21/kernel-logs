import dotenv from "dotenv"

dotenv.config()

export const DB_URL = `mongodb+srv://shivresides:${process.env.DB_PASSWORD}@second-brain.4jq3gmh.mongodb.net/blog-web`
