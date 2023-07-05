import { APIError } from '@/utils/error'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

export const errorHandler = (
    err: APIError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.log(err)
    if (err instanceof APIError)
        return res
            .status(err.status)
            .json({ message: err.message, statusCode: err.status })
    else
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Something went wrong',
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        })
}
