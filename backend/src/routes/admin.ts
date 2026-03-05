import { Router } from "express"
import jwt  from "jsonwebtoken"

const loginRouter = Router()

loginRouter.post("/login", (req, res)=> {
    const password = req.body()

    if (password !== process.env.ADMIN_PASSWORD){
        res.status(403).json({
            message : 'Unauthorized'
        })
        return
    }
    const token = jwt.sign(
       {role : "admin"},
        process.env.ADMIN_PASSWORD!
    )
    res.status(200).json({token})
})

export default loginRouter