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
 *      delete:
 *              summary: Delete user account
 *              tags: ['User']
 *              security:
 *                      - jwtAuth: []
 *              responses:
 *                      200:
 *                              description: Account deleted successfully
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

    await db.user.delete({ where: { uid: user.uid } })
    res.clearCookie('token')
    return res.status(StatusCodes.OK).json({ message: 'Account Deleted' })
}

export const deleteProfile = withValidation(schema, proc)
