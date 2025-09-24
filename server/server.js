import express, {json, urlencoded} from "express"
// import session from "express-session"
// import passport from "passport"
import dotenv from "dotenv"
import cors from "cors"
import db from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import pg from "pg"
// import connectPgSimple from "connect-pg-simple"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "./models/user.js"
// import "./config/passportConfig.js"
import productRoutes from './routes/productRoutes.js'
import cookieParser from "cookie-parser"
import csurf from "csurf"


dotenv.config()

const app = express()
// const pgSession = connectPgSimple(session)

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
// try
// {
//     app.use(session({ 
//                     store: new pgSession ({ pool: pool, tableName: "session"}),
//                     secret: process.env.SESSION_SECRET || "secret", 
//                     resave: false,
//                     saveUninitialized: false,
//                     cookie:{ maxAge: 6000 * 60 *60,
//                         httpOnly: true,
//                         secure: process.env.Node_ENV === "production",
//                         sameSite: "lax",
//                      },
//                     }))
// }
// catch(error)
// {
//     console.error("Session store Error:", error)
// }

// app.use(passport.initialize())
// app.use(passport.session())

app.use("/api/auth", authRoutes)
app.use('/api', productRoutes)

const PORT = process.env.PORT

// app.post("/api/auth/login", async(req, res) => {
//     console.log("Login Request Body: ", req.body)
//     const { username, password} = req.body
//     if(!username || !password)
//     {
//         return res.status(200).json({ error: "Username and password are required" })
//     }

//     try
//     {
//         const user = await User.findOne({ username })
//         if(!user)
//         {
//             return res.status(401).json({ error: "Invalid credentials" })
//         }

//         const isMatch=await bcrypt.compare(password, user.password)
//         if(!isMatch)
//         {
//             return res.status(401).json({ error: "Invalid credentials" })
//         }

//         const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h"})
//         return res.status(200).json({message: "Login successful", token})
//     }
//     catch(error)
//     {
//         console.log("Login error:", error)
//         return res.status(500).json({error: "Internal server error", message: error.message})
//     }
// })

//Stripe PAYMENT
// app.use("/api/payment", paymentRoutes)

app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`))