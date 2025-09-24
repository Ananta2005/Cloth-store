import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { deleteFromCloudinary } from "../utils/cloudinary.js"
import fs from "fs"
import Product from '../models/Product.js'
import Rating from "../models/Rating.js"
import { error } from "console"

export const getProducts = async(req, res) => {
    try{
        const products = await Product.findAll()
        res.json(products)
    }
    catch(error)
    {
        res.status(500).json({ error: 'Failed to fetch products' })
    }
}


export const addProduct = async(req, res) => {
    try{
        console.log("REQ.BODY:", req.body)
        console.log("REQ.FILE:", req.file)

        const localPath = req.file?.path
        const cloudinaryResult = await uploadOnCloudinary(localPath)

        if(!cloudinaryResult)
        {
            return res.status(500).json({ error: "Image upload failed" })
        }

        if(fs.existsSync(localPath)) fs.unlinkSync(localPath)


        const product = await Product.create({ ...req.body, image: cloudinaryResult.secure_url, imagePublicId: cloudinaryResult.public_id })
        res.status(201).json(product)
    }
    catch(error)
    {
        console.error("Add product error:", error)
        res.status(400).json({ error: 'Failed to add Products', message: error.message })
    }
}


export const updateProduct = async(req, res) => {
    try{
        const { id } = req.params

        let imageUrl = req.body.image
        if(req.file)
        {
            const localPath = req.file.path
            const cloudinaryResult = await uploadOnCloudinary(localPath)

            if (!cloudinaryResult) 
            {
                return res.status(500).json({ error: "Image upload failed" })
            }
            if(fs.existsSync(localPath))
             {
                fs.unlinkSync(localPath)
             }
            imageUrl = cloudinaryResult.secure_url
        }

        const [updated]= await Product.update({ ...req.body, image:imageUrl }, { where: {id} })      
        {
            const updatedProduct = await Product.findByPk(id)
            res.json(updatedProduct)
        }
        // else
        // {
        //     res.status(404).json({ error: 'Product not found' })
        // }
    }
    catch(error)
    {
        res.status(400).json({ error: 'Failed to update product', message: error.message })
    }
}


export const deleteProduct = async(req,res) => {
    try{
        const id = parseInt(req.params.id, 10)
        console.log("Delete request for ID:", id)

        if (isNaN(id)) 
        {
             return res.status(400).json({ error: 'Invalid product ID' })
        }

        const productToDelete = await Product.findByPk(id)

        if(!productToDelete)
        {
            return res.status(404).json({ error: 'Product not found' })
        }

        if(productToDelete.imagePublicId)
        {
            const result = await deleteFromCloudinary(productToDelete.imagePublicId)
            console.log("Cloudinary delete result: ", result)
        }

        await Rating.destroy({where: {productId: id }})   

        await productToDelete.destroy();
        res.json({message: "Product and associated image deleted from cloudinary"})
        
    }
    catch(error)
    {
        console.log("Delete product error: ", error)
        res.status(500).json({ error: 'Failed to delete product', message: error.message })
    }
}

