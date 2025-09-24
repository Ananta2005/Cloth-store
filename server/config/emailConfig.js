import nodemailer from "nodemailer"
import dotenv from "dotenv"
// import { Verification_Email_Template } from "./email_Templates.js"

dotenv.config()

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS,
    },
    tls:{
        rejectUnauthorized: false,
    },
    logger: true,
    debug: true,
})


// export const SendEmail = async(email, verificationCode) =>{
//     try 
//     {
//         const info = await transporter.sendMail({
//             from: ` "Ananta 😎" <${process.env.EMAIL_USER}>`,
//             to: email,
//             subject: "Verify your Email ✌️",
//             text: `Your Verification Code is: ${verificationCode}`,
//             html: Verification_Email_Template.replace("{verificationCode}", verificationCode),
//         })
//         console.log("Email sent successfully:", info.response)
//     }
//     catch (error)
//     {
//         console.error("Email sending failed:", error)
//     }
// }

// // SendEmail()