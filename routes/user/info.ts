import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { getPayload } from '@/utils/jwt'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'

const schema = z.object({
    body: z.object({}),
})

const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    const user = getPayload(req.cookies['token'])
    if (!user) return

    const data = await db.user.findUnique({
        where: { uid: user.uid },
        select: { uid: true, name: true, email: true, createdAt: true },
    })

    return res.status(StatusCodes.OK).json(data)
}

export const getUserInfo = withValidation(schema, proc)
