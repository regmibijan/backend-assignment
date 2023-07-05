import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { getPayload } from '@/utils/jwt'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'
import { OrderStatus } from '@prisma/client'

const schema = z.object({
    body: z.object({}),
})

const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    const user = getPayload(req.cookies['token'])

    const orders = db.order.findMany({
        where: { status: OrderStatus.CARTED, userUid: user?.uid },
        select: {
            oid: true,
            product: { select: { name: true } },
            quantity: true,
            updatedAt: true,
        },
    })

    return res.status(StatusCodes.OK).json(orders)
}

export const getUserCart = withValidation(schema, proc)
