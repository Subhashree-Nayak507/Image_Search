import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ImageRouter from "./routes/image.route.js";

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/v1/search',ImageRouter);

const PORT= process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(` Server is runing on port ${PORT}`)
})