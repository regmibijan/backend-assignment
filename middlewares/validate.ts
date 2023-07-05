import { AnyZodObject, ZodError } from 'zod'
import { Request, Response, NextFunction } from 'express'

export const withValidation =
    (
        schema: AnyZodObject,
        proc: (req: Request, res: Response, input: any) => any
    ) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const input = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            })
            await proc(req, res, input)
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(500).json(err)
            } else {
                next(err)
            }
        }
    }
