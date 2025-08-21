# Docker Configuration for Food App

This document provides information about the Docker configuration for the Food App project.

## Overview

The Food App uses Docker and Docker Compose to containerize and orchestrate the following services:

- **Backend**: Node.js Express API
- **Frontend**: React Vite application
- **Admin**: React Vite admin panel
- **MongoDB**: Database service
- **Nginx**: Reverse proxy for production

## Docker Files

### Dockerfiles

- `backend/Dockerfile`: Production build for the backend service
- `frontend/Dockerfile`: Production build for the frontend service
- `admin/Dockerfile`: Production build for the admin service
- `backend/Dockerfile.dev`: Development configuration with hot-reloading for backend
- `frontend/Dockerfile.dev`: Development configuration with hot-reloading for frontend
- `admin/Dockerfile.dev`: Development configuration with hot-reloading for admin

### Docker Compose Files

- `docker-compose.yml`: Default configuration for local development
- `docker-compose.dev.yml`: Development configuration with hot-reloading
- `docker-compose.prod.yml`: Production configuration with Nginx and optimized settings

## Environment Configuration

Each service has its own `.env.example` file that should be copied to `.env` for local development:

- `backend/.env.example` → `backend/.env`
- `frontend/.env.example` → `frontend/.env`
- `admin/.env.example` → `admin/.env`

For production, a root `.env` file is used with the `docker-compose.prod.yml` configuration.

## Usage

### Development

To start the application in development mode with hot-reloading:

```bash
docker-compose -f docker-compose.dev.yml up
```

This will start all services with the following URLs:

- Backend API: http://localhost:4000
- Frontend: http://localhost:5173
- Admin Panel: http://localhost:5174
- MongoDB: localhost:27017

### Production

To start the application in production mode:

1. Create a `.env` file in the project root with production values
2. Set up SSL certificates in `nginx/ssl/`
3. Update domain names in `nginx/nginx.conf`
4. Run:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Helper Scripts

The project includes helper scripts to set up the environment:

- For Linux/macOS: `scripts/setup-env.sh [development|production]`
- For Windows: `scripts\setup-env.bat [development|production]`

These scripts will:

1. Check for required tools (Docker, Docker Compose)
2. Set up environment files from examples
3. Create necessary directories
4. Optionally start the application

## Volumes

- `mongo-data`: Persists MongoDB data
- Local volume mounts in development mode for hot-reloading

## Networks

- `app-network`: Internal network for service communication

## Scaling (Production)

To scale services in production:

```bash
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

## Troubleshooting

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Rebuilding Services

```bash
docker-compose build --no-cache backend
docker-compose up -d
```

### Accessing Containers

```bash
docker exec -it food-app-backend sh
```

For more detailed deployment information, see the `DEPLOYMENT.md` file.