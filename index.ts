import { app } from '@/config/app'
import { env } from '@/config/env'
import { errorHandler } from './middlewares/errorHandler'
import { userRouter } from './routes/user'
import swaggerDocs from './config/swagger'
import { productRouter } from './routes/product'
import { orderRouter } from './routes/order'
import { reportRouter } from './routes/report'

swaggerDocs(app, env.PORT)

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/user', userRouter)
app.use('/product', productRouter)
app.use('/order', orderRouter)
app.use('/report', reportRouter)
app.use(errorHandler)

app.listen(env.PORT, () => {
    console.log(`Server is running at http://localhost:${env.PORT}`)
})
