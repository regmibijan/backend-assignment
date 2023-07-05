import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { getPayload } from '@/utils/jwt'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'
import { hashSync } from 'bcryptjs'

const schema = z.object({
    body: z.object({
        password: z.string().min(8).optional(),
        name: z.string().optional(),
    }),
})

const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    if (input.body.password)
        input.body.password = hashSync(input.body.password, 10)

    const user = getPayload(req.cookies['token'])
    if (!user) return
    await db.user.update({ where: { uid: user.uid }, data: input.body })
    return res.status(StatusCodes.OK).json({ message: 'Updated user' })
}

export const updateProfile = withValidation(schema, proc)
