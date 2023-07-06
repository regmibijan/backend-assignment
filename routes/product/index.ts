import { Router } from 'express'
import { createProduct } from './create'
import { getProduct } from './get'
import { updateProduct } from './update'
import { refillProduct } from './refill'
import { deleteProduct } from './delete'
import { withRole } from '@/middlewares/withRole'

export const productRouter = Router()

productRouter.get('/', getProduct)
productRouter.post('/', withRole(['canAddProduct']), createProduct)
productRouter.patch('/', withRole(['canAddProduct']), updateProduct)
productRouter.delete('/', withRole(['canAddProduct']), deleteProduct)

productRouter.post('/restock', withRole(['canRefillProduct']), refillProduct)
