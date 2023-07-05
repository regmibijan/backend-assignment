import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { getPayload } from '@/utils/jwt'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'

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
