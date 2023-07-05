import { APIError } from '@/utils/error'
import { getPayload } from '@/utils/jwt'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export const withAuth = (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies['token']

    if (!token)
        throw new APIError({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Missing token',
        })

    const payload = getPayload(token)
    if (!payload) {
        res.clearCookie('token')
        throw new APIError({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Failed to verify token',
        })
    }

    return next()
}
