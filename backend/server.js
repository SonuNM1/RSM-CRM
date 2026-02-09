import express from "express" ; 
import dotenv from "dotenv" ; 
dotenv.config() ; 
import connectDB from "./src/config/db.js";
import cors from "cors" ; 
import chalk from "chalk" ; 
import authRoutes from "./src/routes/auth.routes.js"

const app = express() ; 
const PORT = process.env.PORT || 5000 ; 

// middlewares 

app.use(express.json()) ; 
app.use(cors())

// for test 

app.get('/', (req, res) => {
    res.send("API is running")
})

// Routes 

app.use("/api/auth/admin", authRoutes)

// server runs only if DB connects 

const startServer = async () => {
    try {
        await connectDB() ; 

        app.listen(PORT, () => {
            console.log(chalk.bold.yellow(`Server running on http://localhost:${PORT}`))
        })
    } catch (error) {
        console.error(chalk.bold.red("Database connection error: ", error.message)) ; 
        process.exit(1) ; 
    }
}

startServer() ; 

// the eyes chico, they never lie 