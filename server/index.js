// creating the server
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 6000;

app.get("/", (req, res) => {
    return res.json({ message: "server started" });
});

await connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
