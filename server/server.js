import express, {json, urlencoded} from "express"
import dotenv from "dotenv"
import cors from "cors"
import db from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import pg from "pg"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "./models/user.js"
import productRoutes from './routes/productRoutes.js'
import cookieParser from "cookie-parser"
import csurf from "csurf"


dotenv.config()

const app = express()

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
})


const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
}


app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ limit:"10mb", extended:true }))


app.get("/api/csrf-token", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken(), {
        httpOnly: false,
        secure: false,
        sameSite: "Lax"
    })
    res.status(200).json({ csrfToken: req.csrfToken() })
})


app.use("/api/auth", authRoutes)
app.use('/api', productRoutes)

const PORT = process.env.PORT



app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`))