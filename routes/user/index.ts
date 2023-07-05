import { Router } from 'express'

import { login } from './login'
import { register } from './register'
import { withSuperAdmin } from '@/middlewares/withSuperAdmin'
import { createRole } from './createRoles'
import { assignRole } from './assignRole'

export const userRouter = Router()

userRouter.post('/login', login)
userRouter.post('/register', register)

userRouter.post('/createrole', withSuperAdmin, createRole)
userRouter.post('/assignrole', withSuperAdmin, assignRole)
