import { TypeOf, z } from 'zod'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'
import db from '@/config/prisma'
import { APIError } from '@/utils/error'
import { compareSync } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { env } from '@/config/env'

const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
    }),
})

const loginProc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof loginSchema>
) => {
    const { email, password } = input.body
    const user = await db.user.findUnique({
        where: { email },
        select: { email: true, password: true },
    })

    if (!user)
        throw new APIError({
            status: StatusCodes.NOT_FOUND,
            message: 'User not found',
        })

    if (!compareSync(password, user.password))
        throw new APIError({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Invalid password',
        })

    const payload = { email }
    res.cookie('token', sign(payload, env.JWTSECRET))

    return res.status(StatusCodes.OK).json({ message: 'Logged In' })
}

export const login = withValidation(loginSchema, loginProc)
