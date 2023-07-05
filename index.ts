import { app } from '@/config/app'
import { env } from '@/config/env'

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(env.PORT, () => {
    console.log(`Server is running at http://localhost:${env.PORT}`)
})
