import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";
import ImageRouter from "./routes/image.route.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? ['https://image-search-abwm.onrender.com']
    : ['http://localhost:5173', 'http://localhost:4000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/v1/search', ImageRouter);
app.use('/api/v1/auth', authRouter);


// Production configuration
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});