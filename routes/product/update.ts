import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'

/**
 * @swagger
 * components:
 *      schemas:
 *              updateProduct:
 *                      type: object
 *                      required:
 *                              - pid
 *                      properties:
 *                              pid:
 *                                      type: string
 *                              name:
 *                                      type: string
 *                              description:
 *                                      type: string
 *                              manufacturer:
 *                                      type: string
 *                              unitPrice:
 *                                      type: integer
 */
const schema = z.object({
    body: z.object({
        pid: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        manufacturer: z.string().optional(),
        unitPrice: z.string().transform(Number).optional(),
    }),
})

const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    await db.product.update({
        where: { pid: input.body.pid },
        data: input.body,
    })
    return res.status(StatusCodes.OK).json({ message: 'Updated product' })
}

export const updateProduct = withValidation(schema, proc)
