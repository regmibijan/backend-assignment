import { APIError } from '@/utils/error'
import { getPayload } from '@/utils/jwt'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export const withRole = (
    roles: (
        | 'isSuperAdmin'
        | 'canOrder'
        | 'canAddProduct'
        | 'canRefillProduct'
    )[]
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ').pop()

        if (!token)
            throw new APIError({
                status: StatusCodes.UNAUTHORIZED,
                message: 'Missing token',
            })

        const payload = getPayload(req)
        if (!payload) {
            throw new APIError({
                status: StatusCodes.UNAUTHORIZED,
                message: 'Failed to verify token',
            })
        }

        if (!payload.role)
            throw new APIError({
                status: StatusCodes.UNAUTHORIZED,
                message: 'Not priviledged enough to perform this task',
            })

        const authorized = roles.reduce(
            (accum, value) =>
                accum && payload.role != undefined && payload.role[value],
            true
        )

        if (!authorized)
            throw new APIError({
                status: StatusCodes.UNAUTHORIZED,
                message: 'Not priviledged enough to perform this task',
            })

        return next()
    }
}
