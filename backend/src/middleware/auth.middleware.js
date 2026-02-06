import jwt from "jsonwebtoken" 
import User from "../models/user.model"

export const protect = async (req, res, next) => {
    try{
        const token = req.headers.authorization?.split(" ")[1] ; // extracting token from the cookies 

        if(!token){
            return res.status(401).json({
                message: "Not authorized"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) ; 

        const user = await User.findById(decoded.userId) ; 

        if(!user || user.status !="ACTIVE"){
            return res.status(403).json({
                message: "Access denied"
            })
        }

        req.user = user ; 
        next() ; 

    }catch(error){
        res.status(401).json({
            message: "Invalid token"
        })
    }
}