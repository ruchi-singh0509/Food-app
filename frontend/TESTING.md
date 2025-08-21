# Testing Infrastructure for Food-app Frontend

## Overview

This document outlines the testing infrastructure set up for the Food-app frontend. The testing framework uses Jest for running tests and React Testing Library for rendering and testing React components.

## Test Structure

- Component tests are located alongside their respective components
- Context tests are located in the context directory
- Each test file follows the naming convention `*.test.jsx`

## Running Tests

### Prerequisites

- Node.js and npm installed
- All dependencies installed (`npm install`)

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Testing Approach

### Component Testing

Components are tested in isolation using React Testing Library. This approach focuses on testing components from a user's perspective, ensuring that the components behave as expected when interacted with.

Example:
```jsx
test('renders header with title', () => {
  render(<Header />);
  const titleElement = screen.getByText(/Order your favourite food here/i);
  expect(titleElement).toBeInTheDocument();
});
```

### Context Testing

Context providers are tested by rendering a test component that consumes the context and verifying that the context values are correctly provided and updated.

Example:
```jsx
test('adds item to cart', async () => {
  render(
    <StoreContextProvider>
      <TestComponent />
    </StoreContextProvider>
  );
  
  const addButton = screen.getByText('Add to Cart');
  fireEvent.click(addButton);
  
  await waitFor(() => {
    expect(screen.getByTestId('cart-items')).toHaveTextContent('{"item-1":1}');
  });
});
```

### Integration Testing

Integration tests verify that multiple components work together correctly. These tests render a larger portion of the application and test the interactions between components.

Example:
```jsx
test('adds item to cart from food display', async () => {
  render(
    <StoreContextProvider>
      <FoodDisplay category="All" />
    </StoreContextProvider>
  );
  
  const addButton = screen.getAllByText('Add to Cart')[0];
  fireEvent.click(addButton);
  
  // Verify that the item was added to the cart
  // This might involve checking context values or UI updates
});
```

## Mocking

External dependencies like axios, localStorage, and react-router-dom are mocked to isolate the code being tested and to make tests faster and more reliable.

## Coverage Reports

Test coverage reports can be generated using:

```bash
npm run test:coverage
```

This will create a coverage report in the `coverage/` directory, showing which parts of the codebase are covered by tests.

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on testing what the component does, not how it does it.
2. **Use Data Attributes**: Use `data-testid` attributes to select elements for testing.
3. **Mock External Dependencies**: Use Jest's mocking capabilities to mock external dependencies.
4. **Test Edge Cases**: Include tests for error conditions and edge cases.
5. **Keep Tests Simple**: Each test should verify a single behavior or feature.