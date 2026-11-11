// creating the server
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth_route.js";
import userRouter from "./routes/user_route.js";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
const PORT = process.env.PORT || 6000;

app.get("/", (req, res) => {
    return res.json({ message: "server started" });
});

await connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
