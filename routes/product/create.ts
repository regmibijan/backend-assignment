import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { getPayload } from '@/utils/jwt'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'

const createProductSchema = z.object({
    body: z.object({
        name: z.string(),
        description: z.string().default(''),
        manufacturer: z.string(),
        unitPrice: z.string().transform(Number),
    }),
})

const createProductProc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof createProductSchema>
) => {
    const user = getPayload(req.cookies['token'])
    const newProduct = await db.product.create({
        data: {
            ...input.body,
            addedBy: { connect: { uid: user?.uid } },
        },
    })
    return res
        .status(StatusCodes.OK)
        .json({ message: 'Created product', newProduct })
}

export const createProduct = withValidation(
    createProductSchema,
    createProductProc
)
