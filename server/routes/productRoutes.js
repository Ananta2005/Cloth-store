import express from 'express'
import { addProduct, deleteProduct, getProducts, updateProduct } from '../controllers/productControllers.js'
import { addRating, getProductRating } from '../controllers/RatingController.js'
import { jwtAuth } from '../controllers/controller.js'
import {upload} from '../middlewares/multer.middleware.js'

const router = express.Router()

router.get('/products', jwtAuth, getProducts)
router.post('/products', jwtAuth, upload.single('image'), addProduct)
router.patch('/products/:id', jwtAuth, upload.single('image'), updateProduct)
router.delete('/products/:id', jwtAuth, deleteProduct)

router.post('/ratings', jwtAuth, addRating)
router.get('/ratings/:productId', getProductRating)

export default router