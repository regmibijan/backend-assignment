import { app } from '@/config/app'
import { env } from '@/config/env'
import { errorHandler } from './middlewares/errorHandler'
import { userRouter } from './routes/user'

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/user', userRouter)
app.use(errorHandler)

app.listen(env.PORT, () => {
    console.log(`Server is running at http://localhost:${env.PORT}`)
})
