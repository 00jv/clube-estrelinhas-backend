import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clube Estrelinhas API',
      version: '1.0.0',
      description: 'Documentação da API do e-commerce Clube Estrelinhas',
      contact: {
        name: 'Suporte API',
      },
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Servidor Local',
      },
      {
        url: 'https://clube-estrelinhas-backend.vercel.app',
        description: 'Servidor de Produção',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN'] },
            phone: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            price: { type: 'number' },
            image: { type: 'string' },
            category: { type: 'string' },
            tag: { type: 'string' },
            description: { type: 'string' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            status: { type: 'string' },
            total: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/server.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
