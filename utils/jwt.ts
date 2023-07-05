import { env } from '@/config/env'
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

export const getPayload = (token: string) => {
    const payload = decode(token)
    return payload == null ? undefined : (payload as JWTPayload)
}
