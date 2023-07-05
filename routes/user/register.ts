import { APIError } from '@/utils/error'
import db from '@/config/prisma'
import { TypeOf, z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { hashSync } from 'bcryptjs'
import { Request, Response } from 'express'
import { withValidation } from '@/middlewares/validate'

/**
 * @swagger
 * components:
 *      schemas:
 *              register:
 *                      type: object
 *                      required:
 *                              - email
 *                              - password
 *                              - name
 *                      properties:
 *                              email:
 *                                      type: string
 *                              password:
 *                                      type: string
 *                              name:
 *                                      type: string
 */
const registerSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string(),
    }),
})

/**
 * @swagger
 * /user/register:
 *      post:
 *              summary: Register new user account
 *              tags: [User]
 *              requestBody:
 *                      content:
 *                              application/json:
 *                                      schema:
 *                                              $ref: '#/components/schemas/register'
 */
const registerProc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof registerSchema>
) => {
    const { email, password, name } = input.body

    const exists = await db.user.count({ where: { email } })
    if (exists > 0) throw new APIError({ message: 'User already exists' })

    const hashedPassword = hashSync(password, 10)

    await db.user.create({ data: { email, password: hashedPassword, name } })
    return res.status(StatusCodes.OK).json({ message: 'Account Created' })
}

export const register = withValidation(registerSchema, registerProc)
