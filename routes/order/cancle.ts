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
 *              cancelOrder:
 *                      type: object
 *                      required:
 *                              - oid
 *                      properties:
 *                              oid:
 *                                      type: integer
 */
const schema = z.object({
    body: z.object({
        oid: z.string().transform(Number),
    }),
})

/**
 * @swagger
 * /order:
 *      delete:
 *              summary: Cancel an order
 *              tags: [Order]
 *              security:
 *                      - jwtAuth: []
 *              requestBody:
 *                      content:
 *                              application/json:
 *                                      schema:
 *                                              $ref: '#/components/schemas/cancelOrder'
 *              responses:
 *                      200:
 *                              description: Order Canceled
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

    const order = await db.order.findUnique({
        where: { oid: input.body.oid },
        select: { userUid: true },
    })

    const reason =
        user?.uid == order?.userUid ? 'Canceled by user' : 'Canceled by admin'

    await db.order.update({
        where: { oid: input.body.oid },
        data: { status: OrderStatus.ABORTED, comment: reason },
    })
    return res.status(StatusCodes.OK).json({ message: 'Canceled order' })
}

export const cancelOrder = withValidation(schema, proc)
