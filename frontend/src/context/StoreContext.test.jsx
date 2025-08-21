import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StoreContextProvider, { StoreContext } from './StoreContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');

const TestComponent = () => {
  const context = React.useContext(StoreContext);
  return (
    <div>
      <div data-testid="food-list-length">{context.food_list.length}</div>
      <div data-testid="cart-items">{JSON.stringify(context.cartItems)}</div>
      <button onClick={() => context.addToCart('test-item-1')}>Add to Cart</button>
      <button onClick={() => context.removeFromCart('test-item-1')}>Remove from Cart</button>
    </div>
  );
};

describe('StoreContext Provider', () => {
  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    
    // Mock localStorage
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
  });

  test('provides initial context values', async () => {
    // Mock axios responses
    axios.get.mockResolvedValue({ data: { data: [] } });
    axios.post.mockResolvedValue({ data: { cartData: {} } });
    
    render(
      <StoreContextProvider>
        <TestComponent />
      </StoreContextProvider>
    );
    
    // Initial state should have empty food list and cart
    expect(screen.getByTestId('food-list-length')).toHaveTextContent('0');
    expect(screen.getByTestId('cart-items')).toHaveTextContent('{}');
  });

  test('fetches food list on mount', async () => {
    const mockFoodList = [
      { _id: '1', name: 'Pizza', price: 10 },
      { _id: '2', name: 'Burger', price: 8 }
    ];
    
    // Mock axios responses
    axios.get.mockResolvedValue({ data: { data: mockFoodList } });
    axios.post.mockResolvedValue({ data: { cartData: {} } });
    
    render(
      <StoreContextProvider>
        <TestComponent />
      </StoreContextProvider>
    );
    
    // Wait for the food list to be loaded
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  test('adds item to cart', async () => {
    // Mock axios responses
    axios.get.mockResolvedValue({ data: { data: [] } });
    axios.post.mockResolvedValue({ data: { success: true } });
    
    render(
      <StoreContextProvider>
        <TestComponent />
      </StoreContextProvider>
    );
    
    // Add item to cart
    const addButton = screen.getByText('Add to Cart');
    act(() => {
      addButton.click();
    });
    
    // Check if item was added to cart
    await waitFor(() => {
      expect(screen.getByTestId('cart-items')).toHaveTextContent('{"test-item-1":1}');
    });
  });

  test('removes item from cart', async () => {
    // Mock axios responses
    axios.get.mockResolvedValue({ data: { data: [] } });
    axios.post.mockResolvedValue({ data: { success: true } });
    
    render(
      <StoreContextProvider>
        <TestComponent />
      </StoreContextProvider>
    );
    
    // First add item to cart
    const addButton = screen.getByText('Add to Cart');
    act(() => {
      addButton.click();
    });
    
    // Then remove it
    const removeButton = screen.getByText('Remove from Cart');
    act(() => {
      removeButton.click();
    });
    
    // Check if item was removed from cart
    await waitFor(() => {
      expect(screen.getByTestId('cart-items')).toHaveTextContent('{}');
    });
  });

  test('loads cart data when token exists', async () => {
    // Mock localStorage to return a token
    Storage.prototype.getItem.mockReturnValue('mock-token');
    
    // Mock axios responses
    axios.get.mockResolvedValue({ data: { data: [] } });
    axios.post.mockResolvedValue({ 
      data: { 
        cartData: { 'test-item-1': 2 } 
      } 
    });
    
    render(
      <StoreContextProvider>
        <TestComponent />
      </StoreContextProvider>
    );
    
    // Wait for the cart data to be loaded
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(screen.getByTestId('cart-items')).toHaveTextContent('{"test-item-1":2}');
    });
  });
});