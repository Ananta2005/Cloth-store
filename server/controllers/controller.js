import bcrypt from "bcryptjs"
import User from "../models/user.js"
import speakeasy from "speakeasy"
import qrCode from "qrcode"
import jwt from "jsonwebtoken"
import { SendVerificationCode } from "../config/email.js"


const generateAccessToken  = (user) => {
   return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {expiresIn: "15m"})
}

const generateRefreshToken = (user) => {
   return jwt.sign({id: user.id, email: user.email}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "2d"})
}


export const register = async (req, res) => {
   try
   {
       const {name, password, email, isMfaActive, isVerified} = req.body
       console.log(req.body)
       if(!name)
       {
         return res.status(400).json({ message: "Name is required" })
       }
       const existingUser = await User.findOne({ where: {name} })
       if(existingUser)
       {
         return res.status(400).json({ message: "Name already taken. Choose a different name." })
       }

       const hashedPassword = await bcrypt.hash(password, 10)
       const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

       const newUser = new User({
          name,
          email,
          password: hashedPassword,
          isMfaActive: false,
          verificationCode,
          isVerified: false,
       }) 
    
       await newUser.save()

       console.log("Sending OTP to:", email)
       await SendVerificationCode(email, verificationCode)
       res.status(201).json({ message: "User registered successfully", email, name })
   }
   catch(error)
   {
      console.log("Registration error: ", error)
       res.status(500).json({ error: "Error registering user", message: error.message, stack: error.stack})
   }
}


export const VerifyEmail = async(req,res) => {
   try
   {
      const {code} = req.body
      const user = await User.findOne({ where: {verificationCode: code} })

      if(!user)
      {
         return res.status(400).json({success:false, message:"Invalid or Expired code"})
      }

      user.isVerified = true,
      user.verificationCode=undefined
      await user.save()
      return res.status(200).json({success:true, message:"Email verified successfully"})
   } 
   catch (error) 
   {
      console.log(error)
      return res.status(500).json({success:false,message:"Internal server error"})
   }
}


export const login = async (req, res) => {
   try
   {
      const {email, password} = req.body

      const user = await User.findOne({ where: {email} })

      if(!user || !(await bcrypt.compare(password, user.password)))
      {
         return res.status(401).json({ message:"Invalid Credentials."})
      }

      if(!user.isVerified)
      {
         return res.status(401).json({ message: "Please verify your email first." })
      }

      if(user.isMfaActive)
      {
         const shortToken = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, {expiresIn: "5m" })
         return res.status(200).json({ message: "MFA required", isMfaActive: true, token: shortToken, email: user.email, name: user.name, profilePhoto: user.profilePhoto })
      }


      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)

      user.refreshToken = refreshToken
      await user.save()

      res
      .cookie("accessToken", accessToken, {
         httpOnly: true,
         sameSite: "Lax",
         secure: process.env.NODE_ENV === "production",
         maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
         httpOnly: true,
         sameSite: "Lax",
         secure: process.env.NODE_ENV === "production",
         maxAge: 2 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
         message: "Login successful",
         isMfaActive: false,
         email: user.email,
         name: user.name,
         profilePhoto: user.profilePhoto,
   })
   }
   catch(error)
   {
      console.error("Login error", error)
      res.status(500).json({ error: "Error during login", message: error.message })
   }
   
}




export const refreshAccessToken = async(req, res) => {
   const token = req.cookies.refreshToken
   if(!token)
      return res.status(401).json({message: "No refresh token provided" })

   try
   {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
      const user = await User.findOne({ where: {id: decoded.id} })

      if(!user || user.refreshToken !== token)
      {
         return res.status(403).json({message: "Invalid refresh token"})
      }

      const accessToken  = generateAccessToken(user)

      res.cookie("accessToken", accessToken, {
         httpOnly: true,
         sameSite: "Lax",
         secure: process.env.NODE_ENV === "production",
         maxAge: 15 * 60 * 1000
      })

      res.status(200).json({ message: "Access token refreshed"})

   }
   catch(error)
   {
      console.error("Refresh error: ", error.message)
      res.status(403).json({ message: "Invalid refresh token"})
   }
}



export const authStatus = async (req, res) => {
   if(req.user)
   {
        const { password, ...userData } = req.user.get({ plain: true });
        res.status(200).json(userData);   }
   else
   {
      res.status(401).json({ message: "Unauthorized user" })
   }
}


export const logout = async (req, res) => {
   res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
   })
   res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
   })
   return res.status(200).json({message: "Logout successful"})
}


export const setup2FA = async (req, res) => {
   try
   {
      console.log("The req.user is: ", req.user)
      const user = req.user
      var secret = speakeasy.generateSecret()
      console.log("The secret object is : ", secret);
      user.twoFactorSecret = secret.base32;
      user.isMfaActive = true
      await user.save()
      const url  = speakeasy.otpauthURL({
         secret: secret.base32,
         label: `${req.user.name}`,
         issuer: "www.Softy-Clothy.com",
         encoding: "base32",
      })
      const qrImageUrl = await qrCode.toDataURL(url)
      res.status(200).json({
         secret: secret.base32,
         qrCode: qrImageUrl,
      })
   }
   catch(error)
   {
      res.status(500).json({ message: "Error setting up 2FA", error: error.message})
   }
}



export const verify2FA = async (req, res) => {
   const { mfaToken } = req.body
   const user = req.user

   if(!user || !user.twoFactorSecret)
   {
      return res.status(401).json({ message: "Unauthorized or 2FA not setup" })
   }

   const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: mfaToken,
      window: 1,
   })
   if(!verified)
   {
      return res.status(400).json({ message: "Invalid 2FA token" })
   }
  
   const accessToken = generateAccessToken(user)
   const refreshToken = generateRefreshToken(user)

   user.refreshToken = refreshToken
   await user.save()

   res
      .cookie("accessToken", accessToken, {
         httpOnly: true,
         sameSite: "Lax",
         secure: process.env.NODE_ENV === "production",
         maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
         httpOnly: true,
         sameSite: "Lax",
         secure: process.env.NODE_ENV === "production",
         maxAge: 2 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({message: "2FA successful", isMfaActive: true,
         isMfaActive: true, email: user.email, name: user.name, profilePhoto: user.profilePhoto,
      })
}



export const reset2FA = async (req, res) => {
   try
   {
      const user = req.user
      user.twoFactorSecret = ""
      user.isMfaActive= false
      await user.save()
      res.status(200).json({ message: "2FA reset successfully" })
   }
   catch(error)
   {
      res.status(500).json({ error: "Error reseting 2FA ", message: error})
   }
}


export const jwtAuth = async(req, res, next) => {

   let token

   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // 2. If no header, check for the cookie.
    else if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

   if(!token) return res.status(401).json({ message: "Access Token missing" })

   try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findOne({ where: {id: decoded.id} })
      if(!user)
      {
         return res.status(401).json({message: "User not found in jwtAuth"})
      }
      req.user = user
      next()
   }
   catch(err)
   {
      console.log("JWT error: ", err.message)
      return res.status(403).json({message: "Invalid token or expired token"})
   }
}