import { Router } from 'express'

import { login } from './login'
import { register } from './register'

export const userRouter = Router()

userRouter.post('/login', login)
userRouter.post('/register', register)
