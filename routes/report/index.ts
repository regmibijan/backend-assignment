import { Router } from 'express'
import { generateReport } from './generate'

export const reportRouter = Router()

reportRouter.get('/generate', generateReport)
