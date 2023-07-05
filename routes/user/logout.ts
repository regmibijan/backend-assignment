import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'

const schema = z.object({
    body: z.object({}),
})

/**
 * @swagger
 * /user/logout:
 *      delete:
 *              summary: Logs out user
 *              tags: [User]
 */
const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    res.clearCookie('token')
    return res.status(StatusCodes.OK).json({ message: 'Done' })
}

export const logout = withValidation(schema, proc)
