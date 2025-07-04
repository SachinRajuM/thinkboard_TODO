import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "../config/db.js";
import rateLimiter from "../middleware/ratelimiter.js";
// Load environment variables first
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5002;
const __dirname = path.resolve();

// Middleware
if (process.env.NODE_ENV !== "production") {
    app.use(cors({
        origin:"http://localhost:5173",
    })
    );
}
app.use(express.json());
app.use(rateLimiter);

// Apply rate limiter after database connection is established
// app.use((req,res,next) => {
//     console.log(`Req method is ${req.method} &  Req URL is ${req.url}`);
//     next();
// });

app.use("/api/notes", notesRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname,"..","frontend","dist")));
    app.get("*",(req,res) => {
        res.sendFile(path.join(__dirname,"..","frontend","dist","index.html"));
    })
}

// Initialize database connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT : ",PORT);
    });
});




