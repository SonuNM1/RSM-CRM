import jwt from "jsonwebtoken" 
import User from "../models/user.model.js"

export const protect = async (req, res, next) => {
    try{

        const token = req.cookies.accessToken ; // access token from httpOnly cookie

        if(!token){
            return res.status(401).json({
                message: "Not authorized"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) ; 

        const user = await User.findById(decoded.userId) ;

        if(!user || user.status !== "ACTIVE"){
            return res.status(403).json({
                message: "Access denied"
            })
        }

        req.user = {
            _id: user._id, 
            email: user.email, 
            role: user.role, 
            department: user.department, 
            status: user.status
        } ; 
        next() ;   

    }catch(error){
        console.log("Protect middleware error: ", error)
        res.status(401).json({
            message: "Invalid token"
        })
    }
}