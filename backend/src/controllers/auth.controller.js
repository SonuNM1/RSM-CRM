import crypto from "crypto"
import bcrypt from "bcryptjs"
import User from "../models/user.model"
import { generateToken } from "../utils/generateToken"

export const inviteUser = async (req, res) => {
    const {email, password, department} = req.body ; 

    const existingUser = await Usre.findOne({email}) ; 

    if(existingUser){
        return res.status(400).json({
            message: "User already exists"
        })
    }

    const inviteToken = crypto.randomBytes(32).toString("hex") ; // used as invite link token. One-time use and expires. Cryptographically secure. Generates 32 bytes of secure random data. toString("hex") converts it to readable string

    const inviteExpiryHours = Number(process.env.INVITE_EXPIRY_HOURS) || 24 ; 

    const user = await User.create({
        email, 
        role, 
        department, 
        inviteToken, 
        inviteExpiresAt: Date.now() + inviteExpiryHours*60*60*1000  
    })

    // TODO: send email with inviteToken 

    res.status(201).json({
        message: "Invite sent successfully"
    })

}