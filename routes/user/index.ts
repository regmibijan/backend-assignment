import { Router } from 'express'

import { login } from './login'
import { register } from './register'
import { createRole } from './createRoles'
import { assignRole } from './assignRole'

import { withRole } from '@/middlewares/withRole'

export const userRouter = Router()

userRouter.post('/login', login)
userRouter.post('/register', register)

userRouter.post('/createrole', withRole(['isSuperAdmin']), createRole)
userRouter.post('/assignrole', withRole(['isSuperAdmin']), assignRole)
