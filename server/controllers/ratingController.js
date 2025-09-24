import Rating from "../models/Rating.js"
import Product from "../models/Product.js"
import {Op} from "sequelize"

export const addRating = async(req, res) => {
    try
    {
        const { productId, ratingValue } = req.body
        const userId = req.user.id


        const [rating, created] = await Rating.upsert({ productId, userId, ratingValue, })

        res.status(200).json({ message: "Rating Submitted successfully" })
    }

    catch(error)
    {
        res.status(500).json({ error: "Failed to submit rating", message: error.message})
    }
}


export const getProductRating = async(req, res) =>{
    try
    {
        const {productId} = req.params
        console.log("Product ID:", req.params.productId);


        const ratings = await Rating.findAll({ where: { productId } })

        const totalRatings = ratings.length
        const averageRating = ratings.reduce((sum, r) => sum + r.ratingValue, 0) / totalRatings

        if(!ratings || ratings.length === 0)
        {
            return res.json({ averageRating: 0, totalRatings: 0})
        }

        res.json({ averageRating, totalRatings })
    }

    catch(error)
    {
        console.error("❌ Failed to fetch rating:", error)
        res.status(500).json({ error: "Failed to fetch rating", message: error.message })
    }
}