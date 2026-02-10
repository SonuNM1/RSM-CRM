import mongoose from 'mongoose' ; 

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    }, 
    name: {
        type: String // we'll fill this when invite is accepted 
    }, 
    password: {
        type: String, 
        select: false // never auto-fetch password. By default, Mongoose returns all fields when you query a document. This field won't be returned in queries unless we explicitly ask for it 
    }, 
    role: {
        type: String, 
        enum: ["Super_Admin", "Admin", "Email_Executive", "BDE_Executive"], 
        required: true 
    }, 
    department: {
        type: String 
    }, 
    status: {
        type: String, 
        enum: ["INVITED", "ACTIVE", "SUSPENDED"],
        default: "INVITED"
    }, 
    inviteToken: {
        type: String
    }, 
    inviteExpiresAt: {
        type: Date 
    },
    refreshTokens: [
        {
            token: {type: String, required: true},
            expiresAt: {
                type: Date, 
                default: () => new Date(Date.now() + 7*24*60*60*1000)
            }
        }
    ], 
    resetPasswordOTP: {
        type: String
    }, 
    resetPasswordOTPExpires: {
        type: Date 
    },  

    // Rate limit fields 

    otpRequestCount: {
        type: Number, 
        default: 0
    },
    otpRequestWindowStart: {
        type: Date, 
        default: null 
    }, 
    lastOTPRequestAt: {
        type: Date, 
        default: null 
    }

}, {timestamps: true})

export default mongoose.model("User", userSchema)