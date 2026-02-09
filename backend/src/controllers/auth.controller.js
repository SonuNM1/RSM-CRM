import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import chalk from "chalk"

export const inviteUser = async (req, res) => {
  try {
    const { email, password, department, role } = req.body;

    // validating input 

    if(!email || !role){
        return res.status(400).json({
            message: "Email and role are required"
        })
    }

    const existingUser = await User.findOne({ email }); // checking if the user already exists 

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const inviteToken = crypto.randomBytes(32).toString("hex"); // used as invite link token. One-time use and expires. Cryptographically secure. Generates 32 bytes of secure random data. toString("hex") converts it to readable string

    const inviteExpiryHours = Number(process.env.INVITE_EXPIRY_HOURS) || 24;

    const user = await User.create({
      email,
      role,
      department,
      inviteToken,
      inviteExpiresAt: Date.now() + inviteExpiryHours * 60 * 60 * 1000,
      status: "INVITED"
    });

    // TODO: send email with inviteToken - Enail sending will be added later TBD 

    res.status(201).json({
      message: "Invite sent successfully",
    });
  } catch (error) {
    console.error(chalk.red.error("Invite user error: ", error)) ; 
    return res.status(500).json({
        message: "Internal Server Error"
    })
  }
};

export const acceptInvite = async (req, res) => {
    try{
        const {token, password} = req.body ; 

        // basic validation 

        if(!token || !password){
            return res.status(400).json({
                message: "Token and password are required"
            })
        }

        // finding invited user with valid token 

        const user = await findOne({
            inviteToken: token, 
            inviteExpiresAt: {$gt: Date.now()}, // token not expired
            status: "INVITED"
        })

        if(!user){
            return res.status(400).json({
                message: "Invalid or expired token"
            })
        }

        // hashing password securely 

        const salt = await bcrypt.genSalt(10) ; 

        user.password = await bcrypt.hash(password, salt) ; 

        // Activate user 

        user.status = "ACTIVE" ; 

        // destroying invite token (since one-time use)

        user.inviteToken = undefined ; 
        user.inviteExpiredAt = undefined ; 

        await user.save() ; 

        return res.status(200).json({
            message: "Account activated successfully. You can now login"
        })

    }catch(error){
        console.error("Accept invite error: ", error) ; 

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body ; 

        // basic validation 

        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        // Finding user (explicitly include password)

        const user = await User.findOne({email}).select("-password") ; 

        if(!user){
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        // checking account status 

        if(user.status !== "ACTIVE"){
            return res.status(403).json({
                message: "Account is not active"
            })
        }

        // Comparing password using bcrypt 

        const isMatch = await bcrypt.compare(password, user.password) ; 

        if(!isMatch){
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        // Generating jsonwebtoken 

        const token = generateToken(user._id) ; 

        // respond 

        res.status(200).json({
            message: "Login successful", 
            token, 
            user: {
                id: user_id, 
                email: user.email, 
                role: user.role 
            }
        })
    } catch (error) {
        console.error(chalk.bold.red("Admin login error: ", error)) ; 

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}