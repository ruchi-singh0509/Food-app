# Food App Deployment Guide

This document provides instructions for deploying the Food App in different environments using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10.0 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0.0 or higher)
- Git

## Environment Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Food-app
   ```

2. Set up environment variables:
   - Copy the example environment files to create your own:
     ```bash
     cp backend/.env.example backend/.env
     cp frontend/.env.example frontend/.env
     cp admin/.env.example admin/.env
     ```
   - Edit the `.env` files with your specific configuration values

## Development Environment

To run the application in development mode:

```bash
cd Food-app
docker-compose up
```

This will start all services with hot-reloading enabled:
- Backend API: http://localhost:4000
- Frontend: http://localhost:5173
- Admin Panel: http://localhost:5174
- MongoDB: localhost:27017

## Production Environment

To deploy the application in production mode:

1. Create a `.env` file in the project root with production values:
   ```
   MONGODB_URL=mongodb://mongo:27017/food-app
   JWT_SECRET=your_production_jwt_secret
   SESSION_SECRET=your_production_session_secret
   STRIPE_KEY=your_production_stripe_key
   CORS_ORIGIN=https://example.com,https://www.example.com
   API_URL=https://example.com/api
   ```

2. Create SSL certificates for HTTPS:
   ```bash
   mkdir -p nginx/ssl
   # Place your SSL certificates in the nginx/ssl directory
   # fullchain.pem and privkey.pem
   ```

3. Update the domain name in `nginx/nginx.conf` to match your actual domain

4. Start the production stack:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

The application will be available at:
- Frontend: https://example.com
- Admin Panel: https://example.com/admin
- API: https://example.com/api

## Scaling

To scale services in production:

```bash
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

## Monitoring

To view logs:

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

## Backup and Restore

### Database Backup

```bash
docker exec food-app-mongo sh -c 'mongodump --archive' > mongodb-backup-$(date +"%Y-%m-%d").archive
```

### Database Restore

```bash
cat mongodb-backup-YYYY-MM-DD.archive | docker exec -i food-app-mongo sh -c 'mongorestore --archive'
```

## Troubleshooting

### Container Health Check

```bash
docker-compose -f docker-compose.prod.yml ps
```

### Restart Services

```bash
docker-compose -f docker-compose.prod.yml restart backend
```

### Rebuild Services

```bash
docker-compose -f docker-compose.prod.yml build --no-cache backend
docker-compose -f docker-compose.prod.yml up -d
```

## CI/CD Integration

This project can be integrated with CI/CD pipelines like GitHub Actions or GitLab CI. The general workflow would be:

1. Run tests
2. Build Docker images
3. Push images to a registry
4. Deploy using docker-compose

See the CI/CD configuration files for specific implementation details.