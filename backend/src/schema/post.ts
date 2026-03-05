import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    title : String,
    description : String,
    image : String
})

const postModel = mongoose.model("post", postSchema)

export default postModel