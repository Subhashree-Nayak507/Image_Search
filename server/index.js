import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/connectDB.js"
import ImageRouter from "./routes/image.route.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();

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


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
	});
}

const PORT= process.env.PORT || 4000;
app.listen(PORT,()=>{
    connectDB();
    console.log(` Server is runing on port http://localhost:${PORT}`)
})