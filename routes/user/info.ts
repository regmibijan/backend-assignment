import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { getPayload } from '@/utils/jwt'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'

const schema = z.object({
    body: z.object({}),
})

/**
 * @swagger
 * /user:
 *      get:
 *              summary: Get user information
 *              tags: [User]
 *              security:
 *                      - jwtAuth: []
 *              responses:
 *                      200:
 *                              description: User Response
 *                              content:
 *                                      application/json:
 *                                              schema:
 *                                                      type: object
 *                                                      properties:
 *                                                              uid:
 *                                                                      type: string
 *                                                                      description: Unique id of the user
 *                                                              name:
 *                                                                      type: string
 *                                                                      description: Name of the user
 *                                                              email:
 *                                                                      type: string
 *                                                                      description: Email address of the user
 *                                                              createdAt:
 *                                                                      type: string
 *                                                                      description: Account creation date
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
    const user = getPayload(req)
    if (!user) return

    const data = await db.user.findUnique({
        where: { uid: user.uid },
        select: { uid: true, name: true, email: true, createdAt: true },
    })

    return res.status(StatusCodes.OK).json(data)
}

export const getUserInfo = withValidation(schema, proc)
