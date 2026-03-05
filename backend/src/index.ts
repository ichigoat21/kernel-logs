import express from "express"
import mongoose from "mongoose"
import { DB_URL } from "./db/db"

const start = async ()=> {
    await mongoose.connect(DB_URL)
    console.log("DB CONNECTED")
}
const app = express()
app.use(express.json())


const PORT = 3000


app.listen(PORT, ()=> {
    console.log("Server is up")
    start()
})