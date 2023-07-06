import { env } from '@/config/env'
import { Request } from 'express'
import { sign, decode } from 'jsonwebtoken'

interface JWTPayload {
    uid: string
    role?: {
        name: string
        isSuperAdmin: boolean
        canOrder: boolean
        canAddProduct: boolean
        canRefillProduct: boolean
    }
}

export const createToken = (payload: JWTPayload) => {
    return sign(payload, env.JWTSECRET)
}

export const getPayload = (req: Request) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return undefined
    const payload = decode(token)
    return payload == null ? undefined : (payload as JWTPayload)
}
