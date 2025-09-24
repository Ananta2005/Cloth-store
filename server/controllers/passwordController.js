import crypto from "crypto"
import bcrypt from "bcryptjs"
import { Op } from "sequelize"
import User from "../models/user.js"
import {SendResetPasswordLink} from "../config/email.js"

export const forgetPassword = async(req, res) => {
    try
    {
        const {email} = req.body

        if(!email)
            return res.status(400).json({message: "Email is required"})

        const user = await User.findOne({where: {email}})
        if(!user)
            return res.status(404).json({message: "Email not found"})

        const resetToken = crypto.randomBytes(32).toString("hex")
        user.resetToken = resetToken
        user.resetTokenExpiry = Date.now() + 1000*60*10
        await user.save()

        const resetURL = `http://localhost:5173/change-password/${resetToken}`
        await SendResetPasswordLink(email, resetURL)

        res.status(200).json({message: "Reset email sent"})
    }
    catch(error)
    {
        console.error("Error in forgetPassword", error)
        res.status(500).json({message: "Server Error in forgetPassword"})
    }
}



export const resetPassword = async(req, res) =>{
    try
    {
        const {token} = req.params
        const {password} = req.body

        const user = await User.findOne({where: {resetToken: token, resetTokenExpiry: { [Op.gt]:Date.now() } }})
        if(!user)
            return res.status(404).json({message: "Invalid token"})

        const hashPassword = await bcrypt.hash(password, 10)
        user.password = hashPassword
        user.resetToken = null
        user.resetTokenExpiry = null
        await user.save()

        res.status(200).json({message: "Password Reset Successfully"})
    }
    catch(error)
    {
        console.log("Reset Password failed: ", error)
        res.status(404).json({message: "Reset password error"})
    }
}




export const updatePassword = async(req, res) => {
    try
    {
        const {oldPassword} = req.body
        const {newPassword} = req.body
        const {email} = req.body

        const user = await User.findOne({ where: {email} })
        if(!user)
        {
            return res.status(404).json("Email is not valid.")
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password)

        if(!isMatch)
        {
            return res.status(404). json("Password didn't match")
        }
        const hashNewPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashNewPassword

        await user.save()
        res.status(200).json({ message: "Password Updated successfully"})
    }

    catch(error)
    {
        console.error("Password update error ", error)
        res.status(500).json({message: "Failed to update password", error: error.message })
    }
}