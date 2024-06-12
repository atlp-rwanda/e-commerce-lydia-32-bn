import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import log from './logger.js';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-COMMERCE-LYDIA-32 API',
      version: '0.1',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
      {
        url: 'https://e-commerce-lydia-32-bn.onrender.com',
      },
      {
        url: 'https://team-lydia-demo.onrender.com',
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
            firstname: { type: 'string' },
            othername: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            password: { type: 'string' },
            usertype: { type: 'boolean' },
            street: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            postal_code: { type: 'string' },
            country: { type: 'string' },
          },
          required: ['names', 'email', 'password'],
        },
        Product: {
          type: 'object',
          properties: {
            userId: { type: 'number' },
            productName: { type: 'string' },
            description: { type: 'string' },
            productCategory: { type: 'string' },
            price: { type: 'number' },
            quantity: { type: 'number' },
            discount: { type: 'number' },
            dimensions: { type: 'JSON' },
            images: { type: 'array' },
          },
          required: [
            'userId',
            'productname',
            'description',
            'productCategory',
            'price',
            'quantity',
            'dimension',
            'images',
          ],
        },
        WishList: {
          type: 'object',
          properties: {
            userId: { type: 'number' },
            productId: { type: 'number' },
            createdAt: { type: 'Date' },
            UpdatedAt: { type: 'Date' },
          },
          required: ['userId', 'productId'],
        },
        Order: {
          type: 'object',
          properties: {
            userId: { type: 'number' },
            orderDate: { type: 'string', format: 'date-time' },
            totalAmount: { type: 'number' },
            paymentMethod: { type: 'string' },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            orderId: { type: 'number' },
            productId: { type: 'number' },
            unitPrice: { type: 'number' },
            dimensions: { type: 'array' },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            productId: { type: 'number' },
            quantity: { type: 'number' },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            userId: { type: 'number' },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            amount: { type: 'number' },
            currency: { type: 'string' },
            orderId: { type: 'number' },
          },
        },
        Rating: {
          type: 'object',
          properties: {
            userId: { type: 'number' },
            productId: { type: 'number' },
            ratingValue: { type: 'string' },
            review: { type: 'string' },
          },
        },
        Role: {
          type: 'object',
          properties: {
            roleId: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'create' },
          },
          required: ['roleId', 'name'],
        },
        Permission: {
          type: 'object',
          properties: {
            permissionId: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'create' },
          },
          required: ['permissionId', 'name'],
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            userId: { type: 'number' },
            message: { type: 'string' },
            readStatus: { type: 'boolean' },
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  },
  apis: ['./src/server.ts', './src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  // Serve Swagger UI
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.use((req, res, next) => {
    const host = req.get('host');
    const { protocol } = req;
    log.info(`Swagger docs available at ${protocol}://${host}/docs`);
    next();
  });
}

export default swaggerDocs;
