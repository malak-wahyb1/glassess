import Express  from "express";
import cors from "cors"
import router from "./app/index.js";
import dotenv from "dotenv"
import { connectToDatabase } from "./app/config/db.js";

dotenv.config()
connectToDatabase()


const app = Express();
const PORT = process.env.PORT || 8080;


app.use(cors())
app.use(Express.json())

app.use("/api", router)

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`)
})