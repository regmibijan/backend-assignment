import { Express, Request, Response } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options: swaggerJsdoc.OAS3Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sales Management Platform APIs',
            version: '0.1.0',
        },
        servers: [{ url: 'http://localhost:4000/' }],
        components: {
            securitySchemas: {
                cookieAuth: {
                    type: 'jwt',
                    in: 'cookie',
                    name: 'token',
                },
            },
        },
    },
    apis: ['./index.ts', './**/*.ts'],
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app: Express, port: number) {
    // Swagger page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    // Docs in JSON format
    app.get('/docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })

    console.log(`Docs available at http://localhost:${port}/docs`)
}

export default swaggerDocs
