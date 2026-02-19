import jwt from "jsonwebtoken"

// short-lived access

export const generateToken = (userId, expiresIn = "15m") => {
    return jwt.sign(
        {userId}, 
        process.env.JWT_SECRET, 
        {
            expiresIn
        }
    )
}

// long-lived 

export const generateRefreshToken = (userId, expiresIn = "7d") => {
    return jwt.sign(
        {userId}, 
        process.env.JWT_REFRESH_TOKEN, 
        {
            expiresIn
        }
    )
}
