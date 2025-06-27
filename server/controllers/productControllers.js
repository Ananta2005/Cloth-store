import Product from '../models/Product.js'

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
        const product = await Product.create(req.body)
        res.status(201).json(product)
    }
    catch(error)
    {
        res.status(400).json({ error: 'Failed to add Products', message: error.message })
    }
}


export const updateProduct = async(req, res) => {
    try{
        const { id } = req.params
        const [updated]= await Product.update(req.body, { where: {id} })
        if(updated)
        {
            const updatedProduct = await Product.findByPk(id)
            res.json(updatedProduct)
        }
        else
        {
            res.status(404).json({ error: 'Product not found' })
        }
    }
    catch(error)
    {
        res.status(400).json({ error: 'Failed to update product' })
    }
}


export const deleteProduct = async(req,res) => {
    try{
        const {id} = req.params
        const deleted = await Product.destroy({ where: {id} })
        if(deleted)
        {
            res.json({message: 'Product deleted Successfully !' })
        }
        else
        {
            res.status(404).json({ error: 'Product not found' })
        }
    }
    catch(error)
    {
        res.status(500).json({ error: 'Failed to delete product' })
    }
}