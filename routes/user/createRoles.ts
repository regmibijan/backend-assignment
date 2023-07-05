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
 *              requestBody:
 *                      content:
 *                              application/json:
 *                                      schema:
 *                                              $ref: '#/components/schemas/createRole'
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
