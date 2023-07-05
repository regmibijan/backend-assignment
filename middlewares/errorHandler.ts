import { APIError } from '@/utils/error'
import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
    err: APIError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    return res
        .status(err.status)
        .json({ message: err.message, statusCode: err.status })
}
