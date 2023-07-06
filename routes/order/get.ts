import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { getPayload } from '@/utils/jwt'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'
import { APIError } from '@/utils/error'

const schema = z.object({
    query: z.object({
        oid: z.string().transform(Number),
    }),
})

/**
 * @swagger
 * /order?oid=:
 *      get:
 *              summary: Get order information
 *              tags: [Order]
 *              parameters:
 *                      - in: query
 *                        name: oid
 *                        required: true
 *                        schema:
 *                              type: integer
 *              responses:
 *                      200:
 *                              description: Order description received
 *                              content:
 *                                      application/json:
 *                                              schema:
 *                                                      type: object
 *                                                      properties:
 *                                                              quantity:
 *                                                                      type: integer
 *                                                                      description: amount of item
 *                                                              status:
 *                                                                      type: string
 *                                                                      enum: ['CARTED', 'PLACED', 'COMPLETED', 'ABORTED']
 *                                                                      description: status of the order
 *                                                              comment:
 *                                                                      type: string
 *                                                                      description: any comment on the order
 *                                                              total:
 *                                                                      type: integer
 *                                                                      description: total amount of the order
 *                                                              product:
 *                                                                      type: object
 *                                                                      description: product details in the order
 *                                                                      schema:
 *                                                                              properties:
 *                                                                                      pid:
 *                                                                                              type: string
 *                                                                                              description: unique id of the product
 *                                                                                      name:
 *                                                                                              type: string
 *                                                                                              description: name of the product
 *                                                                                      unitPrice:
 *                                                                                              type: string
 *                                                                                              description: price of one unit of the product
 *                                                                                      manufacturer:
 *                                                                                              type: string
 *                                                                                              description: manufacturer of the product
 *                      404:
 *                              description: Order not found
 *                      500:
 *                              description: Internal Server Error
 */
const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    const order = await db.order.findUnique({
        where: { oid: input.query.oid },
        select: {
            quantity: true,
            status: true,
            comment: true,
            product: {
                select: {
                    pid: true,
                    name: true,
                    unitPrice: true,
                    manufacturer: true,
                },
            },
        },
    })
    if (!order)
        throw new APIError({
            status: StatusCodes.NOT_FOUND,
            message: 'Order not found',
        })

    return res
        .status(StatusCodes.OK)
        .json({ ...order, total: order.quantity * order.product.unitPrice })
}

export const getOrder = withValidation(schema, proc)
