import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { getPayload } from '@/utils/jwt'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'
import { OrderStatus } from '@prisma/client'

const schema = z.object({
    body: z.object({
        oid: z.string().transform(Number),
    }),
})

const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    const user = getPayload(req.cookies['token'])

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
