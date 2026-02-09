import chalk from "chalk";
import mongoose from "mongoose" ; 
import dns from "dns" ; 

const connectDB = async () => {
    try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]) ; 

        console.log("MONGO_URI =", process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI) ; 

        console.log(chalk.bold.green("Database Connected"))
    } catch (error) {
        console.error(chalk.bold.red("DB Connection error: ", error)) ; 
        process.exit(1) ; 
    }
}

export default connectDB ; 