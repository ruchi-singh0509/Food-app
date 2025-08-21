# CI/CD Pipeline Documentation

## Overview

This document outlines the Continuous Integration and Continuous Deployment (CI/CD) pipeline implemented for the Food-app project using GitHub Actions. The pipeline automates testing, building, and deployment processes to ensure code quality and streamline releases.

## Pipeline Structure

The CI/CD pipeline consists of the following stages:

1. **Backend Testing**: Runs all backend tests against a MongoDB and Redis instance
2. **Frontend Testing**: Runs all frontend tests
3. **Build**: Creates Docker images for both frontend and backend
4. **Deployment**: Deploys the application to development or production environments

## Workflow Triggers

The pipeline is triggered on:
- **Push** to `main` or `develop` branches
- **Pull Requests** targeting `main` or `develop` branches

## Jobs Description

### 1. Backend Testing (`test-backend`)

- **Environment**: Ubuntu with Node.js 18
- **Services**: MongoDB 4.4 and Redis 6
- **Steps**:
  - Checkout code
  - Setup Node.js
  - Install dependencies
  - Run tests with environment variables

### 2. Frontend Testing (`test-frontend`)

- **Environment**: Ubuntu with Node.js 18
- **Steps**:
  - Checkout code
  - Setup Node.js
  - Install dependencies
  - Run tests

### 3. Build (`build`)

- **Runs after**: Successful completion of both test jobs
- **Triggered by**: Push to `main` or `develop` branches
- **Steps**:
  - Checkout code
  - Setup Docker Buildx
  - Login to DockerHub
  - Build and push backend image
  - Build and push frontend image

### 4. Development Deployment (`deploy-dev`)

- **Runs after**: Successful build
- **Triggered by**: Push to `develop` branch
- **Steps**:
  - Checkout code
  - Install SSH key
  - Deploy to development server using docker-compose

### 5. Production Deployment (`deploy-prod`)

- **Runs after**: Successful build
- **Triggered by**: Push to `main` branch
- **Steps**:
  - Checkout code
  - Install SSH key
  - Deploy to production server using docker-compose

## Required Secrets

The following secrets need to be configured in the GitHub repository:

- `JWT_SECRET`: Secret key for JWT authentication
- `DOCKERHUB_USERNAME`: DockerHub username
- `DOCKERHUB_TOKEN`: DockerHub access token
- `SSH_PRIVATE_KEY`: SSH private key for server access
- `KNOWN_HOSTS`: SSH known hosts file content
- `DEV_SSH_USER`: Development server SSH username
- `DEV_SSH_HOST`: Development server hostname/IP
- `PROD_SSH_USER`: Production server SSH username
- `PROD_SSH_HOST`: Production server hostname/IP

## Setting Up Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each required secret with its corresponding value

## Local Testing

Before pushing changes, you can simulate the CI pipeline locally:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Build Docker images
docker-compose build
```

## Monitoring Workflows

1. Go to your GitHub repository
2. Navigate to the "Actions" tab
3. Select the workflow run you want to inspect
4. View logs and results for each job

## Troubleshooting

### Common Issues

1. **Failed Tests**: Check the test logs to identify the failing tests and fix the issues
2. **Build Failures**: Verify Dockerfile configurations and dependencies
3. **Deployment Issues**: Check SSH connectivity and server configurations

### Workflow Debugging

To debug workflow issues:

1. Add the following step to the job with issues:

```yaml
- name: Debug
  if: always()
  run: |
    env
    ls -la
```

2. Review the logs for the debug step to understand the environment

## Future Improvements

1. Add code quality checks (linting, code coverage)
2. Implement semantic versioning for releases
3. Add notification systems (Slack, email)
4. Implement blue-green deployments
5. Add performance testing