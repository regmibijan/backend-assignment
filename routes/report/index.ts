import { Router } from 'express'
import { generateReport } from './generate'
import { withRole } from '@/middlewares/withRole'

export const reportRouter = Router()

reportRouter.get('/generate', withRole(['isSuperAdmin']), generateReport)
