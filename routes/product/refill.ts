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

const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    const user = getPayload(req.cookies['token'])
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
        .json({ message: 'Updated product', newStock: product.stock })
}

export const refillProduct = withValidation(schema, proc)
