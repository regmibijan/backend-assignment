import { APIError } from '@/utils/error'
import { getPayload } from '@/utils/jwt'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export const withSuperAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token: string = req.cookies['token']

    if (!token)
        throw new APIError({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Missing token',
        })

    const payload = getPayload(token)
    if (!payload.role?.isSuperAdmin)
        throw new APIError({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Not priviledged enough to perform this task',
        })

    next()
}
