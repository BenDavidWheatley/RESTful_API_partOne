const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-commerce API',
            version: '1.0.0',
            description: 'API documentation for the e-commerce platform'
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1/restfulapi',
                description: 'Local development server'
            }
        ]
    },
    apis: ['./src/app/**/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`📄 Swagger documentation available at /api-docs`);
};

module.exports = setupSwagger;
