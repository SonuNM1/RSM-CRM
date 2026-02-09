import jwt from "jsonwebtoken"

// short-lived access

export const generateToken = (userId) => {
    return jwt.sign(
        {userId}, 
        process.env.JWT_SECRET, 
        {
            expiresIn: "15m"
        }
    )
}

// long-lived 

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        {userId}, 
        process.env.JWT_REFRESH_TOKEN, 
        {
            expiresIn: "7d"
        }
    )
}
