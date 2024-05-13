"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
//import fs from 'fs';
const logger_js_1 = __importDefault(require("./logger.js"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-COMMERCE-LYDIA-32 API',
            version: '0.1',
        },
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
                        FirstName: { type: 'string' },
                        otherNames: { type: 'string' },
                        email: { type: 'string' },
                        phone: { type: 'string' },
                        password: { type: 'string' },
                        userType: { type: 'boolean' },
                        street: { type: 'string' },
                        city: { type: 'string' },
                        state: { type: 'string' },
                        postal_code: { type: 'string' },
                        country: { type: 'string' },
                    },
                    required: ['names', 'email', 'password', 'userType'],
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
                        cartId: { type: 'number' },
                        productId: { type: 'number' },
                        quantity: { type: 'number' },
                        Dimensions: { type: 'JSON' },
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
                        userId: { type: 'number' },
                        paymentDate: { type: 'string', format: 'date-time' },
                        totalAmount: { type: 'number' },
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app, port) {
    // Serve Swagger UI
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    app.use((req, res, next) => {
        const host = req.get('host');
        const protocol = req.protocol;
        logger_js_1.default.info(`Swagger docs available at ${protocol}://${host}/docs`);
        next();
    });
}
exports.default = swaggerDocs;
