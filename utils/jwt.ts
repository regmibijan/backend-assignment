import { env } from '@/config/env'
import { sign, decode } from 'jsonwebtoken'

interface JWTPayload {
    email: string
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

export const getPayload = (token: string) => {
    return decode(token) as JWTPayload
}
