import mongoose from "mongoose" ; 
import dotenv from "dotenv" ; 
import bcrypt from "bcryptjs";
import User from "../models/user.model.js"
import connectDB from "../config/db.js";
import chalk from "chalk" ; 

import path from "path" ; 
import { fileURLToPath } from "url";

// telling where .env file is 

const __filename = fileURLToPath(import.meta.url) ; 
const __dirname = path.dirname(__filename) ; 

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
}) ; 

const createSuperAdmin = async () => {
    try {
        connectDB() ;  

        const email = "sonu.mahto362000@gmail.com" ; 
        const password = "123456" ; 
        const role = "Super_Admin" ; 

        // checking if the super admin already exists by a particular email 

        const existingAdmin = await User.findOne({email}) ; 

        if(existingAdmin){
            console.log(chalk.bold.blue("Super admin already exists by this email")) ; 
            process.exit(0) ; 
        }

        // hashing password 

        const salt = await bcrypt.genSalt(10) ; 
        const hashedPassword = await bcrypt.hash(password, salt) ; 

        // creating the user - Super_Admin

        await User.create({
            email, 
            password: hashedPassword, 
            role, 
            status: "ACTIVE", 
            department: "System"
        })

        console.log(chalk.bold.blue("Super admin created successfully")) ; 

        process.exit(0) ; 

    } catch (error) {
        console.error(chalk.bold.red("Error creating super admin: ", error)) ; 
        process.exit(1) ; 
    }
}

createSuperAdmin() ; 