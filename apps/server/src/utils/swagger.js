import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { logger } from './logger.js';
import { ENV } from './env.js';

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'REST API docs',
            version: '1.0.0'
        },
        servers: [
            {
                url: `http://localhost:${ENV.SERVER_PORT}/api/v1`,
                description: "Local server for development"
            }
        ]
    },
    apis: ['./src/modules/*/*.routes.js', './src/modules/*/*.schemas.js']
}

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app, port) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/docs.json', (_, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec)
    })

    logger.info(`API docs available at http://localhost:${port}/api-docs`)
}

export default swaggerDocs
