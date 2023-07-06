import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'
import { getPayload } from '@/utils/jwt'

/**
 * @swagger
 * components:
 *      schemas:
 *              refillProduct:
 *                      type: object
 *                      required:
 *                              - add
 *                              - pid
 *                      properties:
 *                              add:
 *                                      type: integer
 *                              pid:
 *                                      type: string
 */
const schema = z.object({
    body: z.object({
        add: z.string().transform(Number),
        pid: z.string(),
    }),
})

/**
 * @swagger
 * /product/restock:
 *      post:
 *              summary: Restock a product
 *              description: Requires canRefillProduct role
 *              tags: [Product]
 *              security:
 *                      - jwtAuth: []
 *              requestBody:
 *                      content:
 *                              application/json:
 *                                      schema:
 *                                              $ref: '#/components/schemas/refillProduct'
 *              responses:
 *                      200:
 *                              description: Product restocked
 *                              content:
 *                                      application/json:
 *                                              schema:
 *                                                      type: object
 *                                                      properties:
 *                                                              message:
 *                                                                      type: string
 *                                                              newStock:
 *                                                                      type: number
 *                                                                      description: updated amount in stock
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
    const product = await db.product.update({
        where: { pid: input.body.pid },
        data: {
            stock: { increment: input.body.add },
            addedBy: { connect: { uid: user?.uid } },
        },
        select: { stock: true },
    })
    return res
        .status(StatusCodes.OK)
        .json({ message: 'Product restocked', newStock: product.stock })
}

export const refillProduct = withValidation(schema, proc)
