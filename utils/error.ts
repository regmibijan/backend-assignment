import { StatusCodes, getReasonPhrase } from 'http-status-codes'

export class APIError extends Error {
    status: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR

    constructor({
        status = StatusCodes.BAD_REQUEST,
        message,
    }: {
        status?: StatusCodes
        message?: string
    }) {
        super(message || getReasonPhrase(status))
        this.message = message || getReasonPhrase(status)
        this.status = status
    }
}
