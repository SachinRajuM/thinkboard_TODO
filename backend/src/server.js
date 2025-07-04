import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "../config/db.js";
import rateLimiter from "../middleware/ratelimiter.js";
// Load environment variables first
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
    origin:"http://localhost:5173",
})
);
app.use(express.json());
app.use(rateLimiter);

// Apply rate limiter after database connection is established
// app.use((req,res,next) => {
//     console.log(`Req method is ${req.method} &  Req URL is ${req.url}`);
//     next();
// });

app.use("/api/notes", notesRoutes);

// Initialize database connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT : ",PORT);
    });
});




