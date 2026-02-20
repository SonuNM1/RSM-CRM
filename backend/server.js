import dotenv from "dotenv" ; 
dotenv.config() ; 
import express from "express" ; 
import connectDB from "./src/config/db.js";
import cors from "cors" ; 
import chalk from "chalk" ; 
import authRoutes from "./src/routes/auth.routes.js"
import userRoutes from "./src/routes/user.routes.js"
import leadRoutes from "./src/routes/lead.routes.js"
import cookieParser from "cookie-parser"

const app = express() ; 
const PORT = process.env.PORT || 5000 ; 

// middlewares 

app.use(express.json()) ; 
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:8080", 
    credentials: true 
}))

// for test 

app.get('/', (req, res) => {
    res.send("API is running")
})

// Routes 

app.use("/api/auth/", authRoutes) 
app.use("/api/users", userRoutes) ; 
app.use("/api/leads", leadRoutes) ; 

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