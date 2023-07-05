import { TypeOf, z } from 'zod'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'
import db from '@/config/prisma'
import { APIError } from '@/utils/error'
import { compareSync } from 'bcryptjs'
import { createToken } from '@/utils/jwt'

/**
 * @swagger
 * components:
 *      schemas:
 *              login:
 *                      type: object
 *                      required:
 *                              - email
 *                              - password
 *                      properties:
 *                              email:
 *                                      type: string
 *                              password:
 *                                      type: string
 */
const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
    }),
})

/**
 * @swagger
 * /user/login:
 *      post:
 *              summary: Login with email and password
 *              tags: [User]
 *              requestBody:
 *                      content:
 *                              application/json:
 *                                      schema:
 *                                              $ref: '#/components/schemas/login'
 *
 */
const loginProc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof loginSchema>
) => {
    const { email, password } = input.body
    const user = await db.user.findUnique({
        where: { email },
        select: { uid: true, password: true, role: true },
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

    const token = createToken({ uid: user.uid, role: user.role ?? undefined })
    res.cookie('token', token)

    return res.status(StatusCodes.OK).json({ message: 'Logged In' })
}

export const login = withValidation(loginSchema, loginProc)
