import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { getPayload } from '@/utils/jwt'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'

/**
 * @swagger
 * components:
 *      schemas:
 *              createProduct:
 *                      type: object
 *                      required:
 *                              - name
 *                              - manufacturer
 *                              - unitPrice
 *                      properties:
 *                              name:
 *                                      type: string
 *                              description:
 *                                      type: string
 *                              manufacturer:
 *                                      type: string
 *                              unitPrice:
 *                                      type: integer
 */
const createProductSchema = z.object({
    body: z.object({
        name: z.string(),
        description: z.string().default(''),
        manufacturer: z.string(),
        unitPrice: z.string().transform(Number),
    }),
})

/**
 * @swagger
 * /product:
 *      post:
 *              summary: Create new product
 *              tags: [Product]
 *              requestBody:
 *                      required: true
 *                      content:
 *                              application/json:
 *                                      schema:
 *                                              $ref: '#/components/schemas/createProduct'
 *              responses:
 *                      200:
 *                              content:
 *                                      application/json:
 *                                              schema:
 *                                                      type: object
 *                                                      properties:
 *                                                              message:
 *                                                                      type: string
 *                                                              newProduct:
 *                                                                      type: object
 *                                                                      properties:
 *                                                                              pid:
 *                                                                                      type: string
 *
 *
 */
const createProductProc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof createProductSchema>
) => {
    const user = getPayload(req.cookies['token'])
    const newProduct = await db.product.create({
        data: {
            ...input.body,
            addedBy: { connect: { uid: user?.uid } },
        },
        select: { pid: true },
    })
    return res
        .status(StatusCodes.OK)
        .json({ message: 'Created product', newProduct })
}

export const createProduct = withValidation(
    createProductSchema,
    createProductProc
)
