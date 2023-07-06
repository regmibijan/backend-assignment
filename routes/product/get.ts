import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'

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
    return res.status(StatusCodes.OK).json(product)
}

export const getProduct = withValidation(schema, proc)
