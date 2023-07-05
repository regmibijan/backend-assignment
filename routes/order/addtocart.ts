import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { getPayload } from '@/utils/jwt'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'
import { OrderStatus } from '@prisma/client'

/**
 * @swagger
 * components:
 *      schemas:
 *              addToCart:
 *                      type: object
 *                      required:
 *                              - pid
 *                              - quantity
 *                      properties:
 *                              pid:
 *                                      type: string
 *                              quantity:
 *                                      type: integer
 */
const schema = z.object({
    body: z.object({
        pid: z.string(),
        quantity: z.string().transform(Number),
    }),
})

/**
 * @swagger
 * /order/cart:
 *      post:
 *              summary: Add order to cart
 *              tags: [Order]
 *              requestBody:
 *                      content:
 *                              application/json:
 *                                      schema:
 *                                              $ref: '#/components/schemas/addToCart'
 */
const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    const user = getPayload(req.cookies['token'])

    await db.order.create({
        data: {
            product: { connect: { pid: input.body.pid } },
            user: { connect: { uid: user?.uid } },
            quantity: input.body.quantity,
            status: OrderStatus.CARTED,
        },
    })
    return res.status(StatusCodes.OK).json({})
}

export const addToCart = withValidation(schema, proc)
