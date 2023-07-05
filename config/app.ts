import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

export const app = express()

app.use(morgan('tiny'))
app.use(cors())
app.use(cookieParser())

app.use(express.json({ limit: '2mb' }))
app.use(
    express.urlencoded({
        extended: true,
        limit: '2mb',
    })
)
