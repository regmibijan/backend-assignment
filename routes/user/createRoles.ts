import { TypeOf, z } from 'zod'
import { Request, Response } from 'express'
import { withValidation } from '@/middlewares/validate'
import db from '@/config/prisma'
import { StatusCodes } from 'http-status-codes'

/**
 * @swagger
 * components:
 *      schemas:
 *              createRole:
 *                      type: object
 *                      required:
 *                              - name
 *                      properties:
 *                              isSuperAdmin:
 *                                      type: boolean
 *                              canOrder:
 *                                      type: boolean
 *                              canAddProduct:
 *                                      type: boolean
 *                              canRefillProduct:
 *                                      type: boolean
 *                              name:
 *                                      type: string
 */
const createRolesSchema = z.object({
    body: z.object({
        isSuperAdmin: z
            .string()
            .default('false')
            .transform(v => v == 'true'),
        canOrder: z
            .string()
            .default('true')
            .transform(v => v == 'true'),
        canAddProduct: z
            .string()
            .default('false')
            .transform(v => v == 'true'),
        canRefillProduct: z
            .string()
            .default('false')
            .transform(v => v == 'true'),
        name: z.string(),
    }),
})

/**
 * @swagger
 * /user/createrole:
 *      post:
 *              summary: Create new role
 *              tags: [User]
 *              description: Requires isSuperAdmin role
 *              security:
 *                      - jwtAuth: []
 *              requestBody:
 *                      content:
 *                              application/json:
 *                                      schema:
 *                                              $ref: '#/components/schemas/createRole'
 *              responses:
 *                      200:
 *                              description: Role created successfully
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
const createRolesProc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof createRolesSchema>
) => {
    const newRole = await db.roles.create({ data: input.body })
    return res.status(StatusCodes.OK).json({ message: 'Created role', newRole })
}

export const createRole = withValidation(createRolesSchema, createRolesProc)
