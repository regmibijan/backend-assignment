import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { getPayload } from '@/utils/jwt'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'
import { hashSync } from 'bcryptjs'

/**
 * @swagger
 * components:
 *      schemas:
 *              updateUserInfo:
 *                      type: object
 *                      properties:
 *                              password:
 *                                      type: string
 *                              name:
 *                                      type: string
 */
const schema = z.object({
    body: z.object({
        password: z.string().min(8).optional(),
        name: z.string().optional(),
    }),
})

/**
 * @swagger
 * /user/:
 *      patch:
 *              summary: Update user info
 *              tags: [User]
 *              security:
 *                      - jwtAuth: []
 *              requestBody:
 *                      content:
 *                              application/json:
 *                                      schema:
 *                                              $ref: '#/components/schemas/updateUserInfo'
 *              responses:
 *                      200:
 *                              description: Updated Successfully
 *                      401:
 *                              description: Unauthorized
 *                              content:
 *                                      application/json:
 *                                              scheme:
 *                                                      type: object
 *                                                      properties:
 *                                                              status:
 *                                                                      type: string
 *                                                                      description: Status code
 *                                                              message:
 *                                                                      type: string
 *                                                                      description: Reason for the error
 *                      500:
 *                              description: Internal Server Error
 */
const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    if (input.body.password)
        input.body.password = hashSync(input.body.password, 10)

    const user = getPayload(req)
    if (!user) return
    await db.user.update({ where: { uid: user.uid }, data: input.body })
    return res.status(StatusCodes.OK).json({ message: 'Updated user' })
}

export const updateProfile = withValidation(schema, proc)
