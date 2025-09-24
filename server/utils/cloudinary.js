import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath || !fs.existsSync(localFilePath))
        {
            console.log("File not found: ", localFilePath)
            return null
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("File is uploaded on cloudinary", response.secure_url)
        if(fs.existsSync(localFilePath))     fs.unlinkSync(localFilePath)
        return response
    }
    catch(error)
    {
        console.log("Cloudinary upload failed:", error.message)
        if(fs.existsSync(localFilePath))
        {
           fs.unlinkSync(localFilePath)  //remove the locally saved temporary file as the upload operation got failed
        }
        return null 
    }
}


export const deleteFromCloudinary = async(imagePublicId) => {
      try
      {
         if(!imagePublicId)
         {
            console.log("No public ID found in controller.js")
            return null
         }
         const result = await cloudinary.uploader.destroy(imagePublicId)
         return result
      }
      catch(error)
      {
         console.error("Error deleting from cloud: ", error)
         return null
      }
}


export {uploadOnCloudinary}