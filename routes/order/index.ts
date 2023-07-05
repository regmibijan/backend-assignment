import { Router } from 'express'
import { addToCart } from './addtocart'
import { placeOrder } from './place'
import { getOrder } from './get'
import { cancelOrder } from './cancle'
import { getUserCart } from './getcart'
import { withAuth } from '@/middlewares/withAuth'

const orderRouter = Router()

orderRouter.post('/cart', withAuth, addToCart)
orderRouter.get('/cart', withAuth, getUserCart)

orderRouter.get('/', withAuth, getOrder)
orderRouter.post('/', withAuth, placeOrder)
orderRouter.delete('/', withAuth, cancelOrder)
