# API Documentation Guide

## Overview

This project uses Swagger/OpenAPI for comprehensive API documentation. The documentation is automatically generated from JSDoc comments in the route files and provides an interactive UI for exploring and testing the API endpoints.

## Accessing the Documentation

Once the server is running, you can access the Swagger UI documentation at:

```
http://localhost:3000/api-docs
```

## Features

The API documentation includes:

- Detailed information about all API endpoints
- Request parameters and body schemas
- Response formats and status codes
- Authentication requirements
- Interactive testing capability

## API Endpoints

The documentation covers the following API categories:

### User Management
- User registration
- User login/logout
- User profile access

### Food Items
- Adding food items
- Listing available food items
- Removing food items

### Shopping Cart
- Adding items to cart
- Removing items from cart
- Retrieving cart contents

### Orders
- Placing orders
- Verifying orders
- Listing user orders
- Managing order status

### System Monitoring
- Health check endpoint
- System metrics

## Authentication

Many API endpoints require authentication. The documentation specifies which endpoints are protected and what authentication method is required (Bearer token or CSRF token).

## Using the Swagger UI

1. Navigate to the `/api-docs` endpoint in your browser
2. Browse the available endpoints grouped by tags
3. Click on an endpoint to expand its details
4. Use the "Try it out" button to test endpoints directly from the browser
5. For protected endpoints, you'll need to authenticate first by obtaining a token

## Development

The API documentation is generated using:

- `swagger-jsdoc`: Extracts JSDoc comments from route files
- `swagger-ui-express`: Provides the interactive UI

To add documentation for new endpoints, add JSDoc comments above the route definitions following the OpenAPI specification format.

## Example

```javascript
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
```