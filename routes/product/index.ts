import { Router } from 'express'
import { createProduct } from './create'
import { getProduct } from '../order/get'
import { updateProduct } from './update'
import { refillProduct } from './refill'
import { deleteProduct } from './delete'

const productRouter = Router()

productRouter.post('/', createProduct)
productRouter.get('/', getProduct)
productRouter.patch('/', updateProduct)
productRouter.delete('/', deleteProduct)
productRouter.post('/refill', refillProduct)
