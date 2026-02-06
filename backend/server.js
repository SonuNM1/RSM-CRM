import express from "express" ; 
import dotenv from "dotenv" ; 
dotenv.config() ; 
import connectDB from "./src/config/db.js";
import cors from "cors" ; 
import chalk from "chalk"

const app = express() ; 
const PORT = process.env.PORT || 5000 ; 

// middlewares 

app.use(express.json()) ; 
app.use(cors())

// server runs only if DB connects 

const startServer = async () => {
    try {
        await connectDB() ; 

        app.listen(PORT, () => {
            console.log(chalk.bold.green(`Server running on http://localhost:${PORT}`))
        })
    } catch (error) {
        console.error(chalk.bold.red("Database connection error: ", error.message)) ; 
        process.exit(1) ; 
    }
}

startServer() ; 

// the eyes chico, they never lie 