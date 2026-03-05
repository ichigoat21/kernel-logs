import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

interface customRequest extends Request{
    user : JwtPayload
}

interface JwtPayload {
    role: string
  }

export const Middleware = (req : customRequest, res : Response, next : NextFunction) => {
    const AuthHeader = req.headers.authorization

    if(!AuthHeader){
        res.status(400).json({message : "Unauthorized"})
        return
    }
    const token = AuthHeader.split(" ")[1]

    if (typeof token !== "string"){
        res.status(403).json({
            message : "Invalid token"
        })
        return
    }
    
    try {
        const decoded = jwt.verify(token, process.env.ADMIN_PASSWORD!) as JwtPayload
        req.user = decoded 
        next()
    } catch (e){
        res.status(500).json({
            message : `Sorry there was an error: ${e}`
        })
    }
}