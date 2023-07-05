import db from '@/config/prisma'
import { withValidation } from '@/middlewares/validate'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TypeOf, z } from 'zod'

const assignRoleSchema = z.object({
    body: z.object({
        email: z.string().email(),
        role: z.string(),
    }),
})

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
