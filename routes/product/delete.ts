import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'

/**
 * @swagger
 * components:
 *      schemas:
 *              deleteProduct:
 *                      type: object
 *                      required:
 *                              - pid
 *                      properties:
 *                              pid:
 *                                      type: string
 */
const schema = z.object({
    body: z.object({
        pid: z.string(),
    }),
})

/**
 * @swagger
 * /product:
 *      delete:
 *              summary: Delete a product
 *              tags: [Product]
 *              requestBody:
 *                      content:
 *                              application/json:
 *                                      schema:
 *                                              $ref: '#/components/schemas/deleteProduct'
 */
const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    await db.product.delete({ where: { pid: input.body.pid } })
    return res.status(StatusCodes.OK).json({ message: 'Deleted product' })
}

export const deleteProduct = withValidation(schema, proc)
