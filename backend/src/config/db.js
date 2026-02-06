import chalk from "chalk";
import mongoose from "mongoose" ; 

const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI) ; 

        console.log(chalk.bold.green("Database Connected"))
    } catch (error) {
        console.error(chalk.bold.red("DB Connection error: ", error)) ; 
        process.exit(1) ; 
    }
}

export default connectDB ; 