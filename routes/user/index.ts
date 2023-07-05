import { Router } from 'express'

import { withRole } from '@/middlewares/withRole'
import { withAuth } from '@/middlewares/withAuth'

import { login } from './login'
import { register } from './register'
import { logout } from './logout'

import { getUserInfo } from './info'
import { updateProfile } from './update'
import { deleteProfile } from './delete'

import { createRole } from './createRoles'
import { assignRole } from './assignRole'

export const userRouter = Router()

userRouter.post('/login', login)
userRouter.post('/register', register)
userRouter.post('/logout', logout)

userRouter.get('/', withAuth, getUserInfo)
userRouter.patch('/', withAuth, updateProfile)
userRouter.delete('/', withAuth, deleteProfile)

userRouter.post('/createrole', withRole(['isSuperAdmin']), createRole)
userRouter.post('/assignrole', withRole(['isSuperAdmin']), assignRole)
