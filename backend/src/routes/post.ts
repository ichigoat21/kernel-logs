import { Router } from "express";
import postModel from "../schema/post";

const postRouter = Router()

postRouter.post("/add", async (req, res)=> {
    try {
    const title = req.body.title
    const description = req.body.description
    const image = req.body.image

    await postModel.create({
        title, 
        description,
        image
    })

    res.status(200).json({
        message : "Post Added"
    })} catch(e) {
        res.status(500).json({
            message : `Sorry there was an error: ${e}`
        })
    }
})

postRouter.delete("/:id", async (req, res)=> {
    try {
    const id = req.params.id
    await postModel.findByIdAndDelete(id)

    res.status(200).json({
        message : "Item Deleted Successfully"
    })} catch (e){
        res.status(500).json({
            message : `Sorry there was an error: ${e}`
        })
    }
})

postRouter.put("/:id", async(req, res)=> {
    try {
        const id = req.params.id
        const updatedPost = await postModel.findByIdAndUpdate(id, 
            {$set : req.body},
            {new : true}
        )
        res.status(200).json({
            message :"Update",
            post : updatedPost
        })

    } catch (e){
        res.status(500).json({
            message : `Sorry there was an error: ${e}`
        })
    }
})