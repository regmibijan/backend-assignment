import { z, TypeOf } from 'zod'
import { Request, Response } from 'express'
import db from '@/config/prisma'
import { StatusCodes } from 'http-status-codes'
import { withValidation } from '@/middlewares/validate'

BigInt.prototype.toJSON = function () {
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
 *              summary: Generate daily reports
 *              tags: [Report]
 *              parameters:
 *                      - in: query
 *                        name: interval
 *                        required: true
 *                        schema:
 *                              type: string
 *                              enum: ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute']
 */
const proc = async (
    req: Request,
    res: Response,
    input: TypeOf<typeof schema>
) => {
    const data = await db.$queryRaw`
    SELECT 
        sum("unitPrice"*quantity) as total, 
        sum(quantity) as items, 
        DATE_TRUNC('${input.query.interval}', o."updatedAt") as date 
    FROM "Order" o 
    JOIN "Product" p 
    ON p.pid=o."productPid" 
    GROUP BY date
    `

    return res.status(StatusCodes.OK).json(data)
}

export const generateReport = withValidation(schema, proc)
