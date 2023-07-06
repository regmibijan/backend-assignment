import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'
;(BigInt.prototype as any).toJSON = function () {
    return this.toString()
}

const schema = z.object({
    query: z.object({
        interval: z.enum([
            'year',
            'quarter',
            'month',
            'week',
            'day',
            'hour',
            'minute',
        ]),
    }),
})

/**
 * @swagger
 * /report/generate:
 *      get:
 *              summary: Generate total sales report grouped by provided interval
 *              description: Requires isSuperAdmin role
 *              tags: [Report]
 *              security:
 *                      - jwtAuth: []
 *              parameters:
 *                      - in: query
 *                        name: interval
 *                        required: true
 *                        schema:
 *                              type: string
 *                              enum: ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute']
 *              responses:
 *                      200:
 *                              description: Report Generated
 *                              content:
 *                                      application/json:
 *                                              schema:
 *                                                      type: object
 *                                                      properties:
 *                                                              total:
 *                                                                      type: integer
 *                                                                      description: Total money earned in paisa
 *                                                              items:
 *                                                                      type: integer
 *                                                                      description: Total items sold
 *                                                              date:
 *                                                                      type: string
 *                                                                      description: Date at the begining of the interval
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
    console.log('raw query handai')
    const data = await db.$queryRawUnsafe(`
    SELECT 
        sum("unitPrice"*quantity) as total, 
        sum(quantity) as items, 
        DATE_TRUNC('${input.query.interval}', o."updatedAt") as date 
    FROM "Order" o 
    JOIN "Product" p 
    ON p.pid=o."productPid" 
    GROUP BY date
    `)

    return res.status(StatusCodes.OK).json(data)
}

export const generateReport = withValidation(schema, proc)
