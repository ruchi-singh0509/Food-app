import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Food App API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Food App backend services',
      contact: {
        name: 'API Support',
        email: 'support@foodapp.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server'
      },
      {
        url: 'https://api.foodapp.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        csrfToken: {
          type: 'apiKey',
          in: 'header',
          name: 'X-CSRF-Token'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              example: 'Error message'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              example: 'john@example.com'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Food: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            name: {
              type: 'string',
              example: 'Chicken Burger'
            },
            price: {
              type: 'number',
              example: 9.99
            },
            description: {
              type: 'string',
              example: 'Delicious chicken burger with special sauce'
            },
            image: {
              type: 'string',
              example: '/images/1739907148524food_1.png'
            },
            category: {
              type: 'string',
              example: 'Burger'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Cart: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            user: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  food: {
                    type: 'string',
                    example: '60d21b4667d0d8992e610c85'
                  },
                  quantity: {
                    type: 'number',
                    example: 2
                  }
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            user: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  food: {
                    type: 'string',
                    example: '60d21b4667d0d8992e610c85'
                  },
                  quantity: {
                    type: 'number',
                    example: 2
                  },
                  price: {
                    type: 'number',
                    example: 9.99
                  }
                }
              }
            },
            totalAmount: {
              type: 'number',
              example: 19.98
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'cancelled'],
              example: 'pending'
            },
            paymentId: {
              type: 'string',
              example: 'pi_3NqLOIJHwE4QW1Uj1gEQ5PxZ'
            },
            deliveryAddress: {
              type: 'object',
              properties: {
                street: {
                  type: 'string',
                  example: '123 Main St'
                },
                city: {
                  type: 'string',
                  example: 'New York'
                },
                state: {
                  type: 'string',
                  example: 'NY'
                },
                zipCode: {
                  type: 'string',
                  example: '10001'
                },
                country: {
                  type: 'string',
                  example: 'USA'
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Metrics: {
          type: 'object',
          properties: {
            uptime: {
              type: 'number',
              example: 3600
            },
            memoryUsage: {
              type: 'object',
              properties: {
                rss: {
                  type: 'number',
                  example: 50000000
                },
                heapTotal: {
                  type: 'number',
                  example: 30000000
                },
                heapUsed: {
                  type: 'number',
                  example: 20000000
                },
                external: {
                  type: 'number',
                  example: 1000000
                }
              }
            },
            cpuLoad: {
              type: 'number',
              example: 0.5
            },
            requestStats: {
              type: 'object',
              properties: {
                total: {
                  type: 'number',
                  example: 1000
                },
                success: {
                  type: 'number',
                  example: 950
                },
                error: {
                  type: 'number',
                  example: 50
                },
                avgResponseTime: {
                  type: 'number',
                  example: 120
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [join(rootDir, 'routes/*.js'), join(rootDir, 'controllers/*.js')]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;