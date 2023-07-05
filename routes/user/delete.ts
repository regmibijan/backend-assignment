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

    await db.user.delete({ where: { uid: user.uid } })
    res.clearCookie('token')
    return res.status(StatusCodes.OK).json({ message: 'Account Deleted' })
}

export const deleteProfile = withValidation(schema, proc)