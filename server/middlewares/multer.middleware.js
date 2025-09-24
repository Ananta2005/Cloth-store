import multer from "multer"
import fs from 'fs'
import path from 'path'

const tempDir = path.join("public", "temp")
if(!fs.existsSync(tempDir))
{
    fs.mkdirSync(tempDir, {recursive: true})
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, tempDir)
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

 export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp']
        if(allowed.includes(file.mimetype))
        {
            cb(null, true)
        }
        else
        {
            cb(new Error('Invalid file type'), false)
        }
    }
})