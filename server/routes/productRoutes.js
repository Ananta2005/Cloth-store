import express from 'express'
import { addProduct, deleteProduct, getProducts, updateProduct } from '../controllers/productControllers.js'
import { jwtAuth } from '../controllers/controller.js'

const router = express.Router()

router.get('/products', getProducts)
router.post('/products', jwtAuth, addProduct)
router.put('/products/:id', jwtAuth, updateProduct)
router.delete('/products/:id', jwtAuth, deleteProduct)

export default router