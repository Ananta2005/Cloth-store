import { Router } from "express";
import passport from "passport";
import { register, login, logout, authStatus, setup2FA, verify2FA, reset2FA, VerifyEmail } from "../controllers/controller.js"
import {jwtAuth} from "../controllers/controller.js"

import Stripe from "stripe"

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Registration Route
router.post("/register", register)

//OTP verify
router.post("/verifyEmail", VerifyEmail)

// Login Route
router.post("/login", passport.authenticate("local"), login)


// Auth status route
router.get("/status", jwtAuth, authStatus)


// Logout Route
router.post("/logout", logout)

// 2FA setup
router.post("/2fa/setup", jwtAuth, setup2FA)

//verify Route
router.post("/2fa/verify", jwtAuth, verify2FA)

// Reset Route
router.post("/2fa/reset", jwtAuth, reset2FA)



// Stripe Route
router.post("/payment-checkOUT", async (req, res) => {
    const { items, email, sessionId, country } = req.body


    const currency = country === "IN" ? "inr" : "usd"

    const line_items = items.map(item => ({
        price_data :{
            currency,
            product_data: {
                name: item.name,
            },
            unit_amount: item.price * 100,
        },
        quantity: item.quantity,
    }))

    try
    {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
            shipping_address_collection: {
                allowed_countries: ['US', 'IN'],
            },
            receipt_email: email,
            metadata: {
                custom_session_id: sessionId,
                email: email,
            }
        },
        {
            idempotencyKey: sessionId,
        }
    )

        res.json({ id: session.id })
    }

    catch(error)
    {
        console.error("Stripe Checkout Error:", error)
        res.status(500).json({ error: "Failed to create Stripe session" })
    }
})



export default router