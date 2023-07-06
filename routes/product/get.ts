import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'
import { APIError } from '@/utils/error'

const schema = z.object({
    query: z.object({
        pid: z.string(),
    }),
})

/**
 * @swagger
 * /product:
 *      get:
 *              summary: Get product details
 *              tags: [Product]
 *              parameters:
 *                      - in: query
 *                        name: pid
 *                        required: true
 *                        schema:
 *                              type: string
 *              responses:
 *                      200:
 *                              description: Product Description
 *                              content:
 *                                      application/json:
 *                                              schema:
 *                                                      type: object
 *                                                      properties:
 *                                                              pid:
 *                                                                      type: string
 *                                                                      description: Unique id of the product
 *                                                              name:
 *                                                                      type: string
 *                                                              description:
 *                                                                      type: string
 *                                                              manufacturer:
 *                                                                      type: string
 *                                                                      description: Manufacturer of the product
 *                                                              unitPrice:
 *                                                                      type: integer
 *                                                                      description: Price per unit of the product
 *                                                              stock:
 *                                                                      type: integer
 *                                                                      description: Amount of items left in stock
 *                      404:
 *                              description: Product not found
 *                      500:
 *                              description: Internal Server Error
 *
 */
const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    const product = await db.product.findUnique({
        where: { pid: input.query.pid },
        select: {
            pid: true,
            name: true,
            description: true,
            manufacturer: true,
            unitPrice: true,
            stock: true,
        },
    })
    if (!product)
        throw new APIError({
            status: StatusCodes.NOT_FOUND,
            message: 'Product not found',
        })
    return res.status(StatusCodes.OK).json(product)
}

export const getProduct = withValidation(schema, proc)
