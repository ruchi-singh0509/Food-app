# Testing Infrastructure for Food-app Backend

## Overview

This document outlines the testing infrastructure set up for the Food-app backend. The testing framework uses Jest for unit and integration tests, along with Supertest for API endpoint testing.

## Test Structure

- `__tests__/` - Root directory for all tests
  - `controllers/` - Tests for controller functions
  - `middleware/` - Tests for middleware functions
  - `routes/` - API endpoint integration tests
  - `setup.js` - Test setup and utility functions

## Environment Configuration

Tests use a separate environment configuration file (`.env.test`) to ensure they run in isolation from development or production environments. This includes a separate test database to prevent affecting production data.

## Running Tests

### Prerequisites

- Node.js and npm installed
- MongoDB running locally or accessible via connection string

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Writing Tests

### Unit Tests

Unit tests focus on testing individual functions in isolation. Dependencies are mocked using Jest's mocking capabilities.

Example:
```javascript
describe('User Controller', () => {
  it('should validate user input', async () => {
    // Test implementation
  });
});
```

### Integration Tests

Integration tests verify that different parts of the application work together correctly. These tests use Supertest to make HTTP requests to the API endpoints.

Example:
```javascript
describe('User Routes', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/user/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
      });
    
    expect(response.status).toBe(201);
    // Additional assertions
  });
});
```

## Test Database

Tests use a separate MongoDB database (`food-app-test`) to ensure they don't interfere with development or production data. The database is cleared before each test to maintain test isolation.

## Mocking

External dependencies like MongoDB models, bcrypt, and jsonwebtoken are mocked to isolate the code being tested and to make tests faster and more reliable.

## Coverage Reports

Test coverage reports can be generated using:

```bash
npm run test:coverage
```

This will create a coverage report in the `coverage/` directory, showing which parts of the codebase are covered by tests.

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on the state from other tests.
2. **Mock External Dependencies**: Use Jest's mocking capabilities to mock external dependencies.
3. **Clear Database**: Clear the test database before each test to ensure a clean state.
4. **Test Edge Cases**: Include tests for error conditions and edge cases.
5. **Descriptive Test Names**: Use descriptive names for test cases to make it clear what is being tested.