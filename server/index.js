import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/connectDB.js"
import ImageRouter from "./routes/image.route.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

const app = express();

// Middlewares

app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended :true}));
app.use(cookieParser());

app.use('/api/v1/search',ImageRouter);
app.use('/api/v1/auth',authRouter);

const PORT= process.env.PORT || 4000;
app.listen(PORT,()=>{
    connectDB();
    console.log(` Server is runing on port http://localhost:${PORT}`)
})