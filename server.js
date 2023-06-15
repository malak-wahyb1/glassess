import Express  from "express";
import cors from "cors"
import router from "./app/index.js";
import dotenv from "dotenv"
import createError from "http-errors";
import { connectToDatabase } from "./app/config/db.js";

dotenv.config()
connectToDatabase()


const app = Express();
const PORT = process.env.PORT || 8000;

app.use(cors())
app.use(Express.json())

app.use("/api", router)

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`)
})

// Error handlers

app.use((req, res, next) => {
    next(createError(404));
  });
  
  app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send({
      success: false,
      message: err.message,
    });
  });
  