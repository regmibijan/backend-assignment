import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
    clientPrefix: '',
    server: {
        DATABASE_URL: z.string().url(),
        PORT: z.string().regex(/\d+/).transform(Number),
        JWTSECRET: z.string().default('notsosecret'),
    },
    client: {},
    runtimeEnv: process.env,
})
