import mongoose from 'mongoose' ; 

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
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
}, {timestamps: true})

export default mongoose.model("User", userSchema)