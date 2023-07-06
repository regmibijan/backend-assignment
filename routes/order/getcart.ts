import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { getPayload } from '@/utils/jwt'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'
import { OrderStatus } from '@prisma/client'

const schema = z.object({
    body: z.object({}),
})

/**
 * @swagger
 * /order/cart:
 *      get:
 *              summary: Get orders in user's cart
 *              tags: [Order]
 *              responses:
 *                      200:
 *                              description: Get cart of the logged in user
 *                              content:
 *                                      application/json:
 *                                              schema:
 *                                                      type: array
 *                                                      items:
 *                                                              type: object
 *                                                              properties:
 *                                                                      quantity:
 *                                                                              type: integer
 *                                                                              description: amount of item
 *                                                                      status:
 *                                                                              type: string
 *                                                                              enum: ['CARTED', 'PLACED', 'COMPLETED', 'ABORTED']
 *                                                                              description: status of the order
 *                                                                      comment:
 *                                                                              type: string
 *                                                                              description: any comment on the order
 *                                                                      total:
 *                                                                              type: integer
 *                                                                              description: total amount of the order
 *                                                                      product:
 *                                                                              type: object
 *                                                                              description: product details in the order
 *                                                                              schema:
 *                                                                                      properties:
 *                                                                                              pid:
 *                                                                                                      type: string
 *                                                                                                      description: unique id of the product
 *                                                                                              name:
 *                                                                                                      type: string
 *                                                                                                      description: name of the product
 *                                                                                              unitPrice:
 *                                                                                                      type: string
 *                                                                                                      description: price of one unit of the product
 *                                                                                              manufacturer:
 *                                                                                                      type: string
 *                                                                                                      description: manufacturer of the product
 *                      500:
 *                              description: Internal Server Error
 */
const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    const user = getPayload(req.cookies['token'])

    const orders = db.order.findMany({
        where: { status: OrderStatus.CARTED, userUid: user?.uid },
        select: {
            oid: true,
            product: {
                select: {
                    pid: true,
                    name: true,
                    unitPrice: true,
                    manufacturer: true,
                },
            },
            quantity: true,
            updatedAt: true,
        },
    })

    return res.status(StatusCodes.OK).json(orders)
}

export const getUserCart = withValidation(schema, proc)
