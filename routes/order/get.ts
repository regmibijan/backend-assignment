import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { getPayload } from '@/utils/jwt'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'

/**
 * @swagger
 * components:
 *      schemas:
 *              getOrder:
 *                      type: object
 *                      required:
 *                              - oid
 *                      properties:
 *                              oid:
 *                                      type: integer
 */
const schema = z.object({
    query: z.object({
        oid: z.string().transform(Number),
    }),
})

const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    const order = await db.order.findUnique({
        where: { oid: input.query.oid },
        select: { quantity: true, status: true, comment: true },
    })
    return res.status(StatusCodes.OK).json(order)
}

export const getOrder = withValidation(schema, proc)
