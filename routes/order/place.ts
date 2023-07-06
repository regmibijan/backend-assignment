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
 *              placeOrder:
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
 * /order:
 *      post:
 *              summary: Place an order
 *              tags: [Order]
 *              security:
 *                      - jwtAuth: []
 *              requestBody:
 *                      content:
 *                              application/json:
 *                                      schema:
 *                                              $ref: '#/components/schemas/placeOrder'
 *
 *              responses:
 *                      200:
 *                              description: Order Placed successfully
 *                      401:
 *                              description: Unauthorized
 *                              content:
 *                                      application/json:
 *                                              scheme:
 *                                                      type: object
 *                                                      properties:
 *                                                              status:
 *                                                                      type: string
 *                                                                      description: Status code
 *                                                              message:
 *                                                                      type: string
 *                                                                      description: Reason for the error
 *                      500:
 *                              description: Internal Server Error
 */
const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    const user = getPayload(req)

    await db.order.create({
        data: {
            product: { connect: { pid: input.body.pid } },
            user: { connect: { uid: user?.uid } },
            quantity: input.body.quantity,
            status: OrderStatus.PLACED,
        },
    })
    return res.status(StatusCodes.OK).json({ message: 'Placed order' })
}

export const placeOrder = withValidation(schema, proc)
