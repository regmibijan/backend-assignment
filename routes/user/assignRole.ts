import db from '@/config/prisma'
import { withValidation } from '@/middlewares/validate'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TypeOf, z } from 'zod'

/**
 * @swagger
 * components:
 *      schemas:
 *              assignRole:
 *                      type: object
 *                      required:
 *                              - email
 *                              - role
 *                      properties:
 *                              email:
 *                                      type: string
 *                              role:
 *                                      type: string
 */
const assignRoleSchema = z.object({
    body: z.object({
        email: z.string().email(),
        role: z.string(),
    }),
})

/**
 * @swagger
 * /user/assignrole:
 *      post:
 *              summary: Assign a role to a user
 *              tags: [User]
 *              description: Requires isSuperAdmin role
 *              security:
 *                      - jwtAuth: []
 *              requestBody:
 *                      content:
 *                              application/json:
 *                                      schema:
 *                                              $ref: '#/components/schemas/assignRole'
 *              responses:
 *                      200:
 *                              description: Role Assigned successfully
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
const assignRoleProc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof assignRoleSchema>
) => {
    await db.user.update({
        where: { email: input.body.email },
        data: { role: { connect: { name: input.body.role } } },
    })
    return res.status(StatusCodes.OK).json({ message: 'Role assigned' })
}

export const assignRole = withValidation(assignRoleSchema, assignRoleProc)
