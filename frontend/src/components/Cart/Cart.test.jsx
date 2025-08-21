import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cart from './Cart';
import { StoreContext } from '../../context/StoreContext';

describe('Cart Component', () => {
  const mockFoodList = [
    { _id: '1', name: 'Pizza', price: 10, image: 'pizza.jpg' },
    { _id: '2', name: 'Burger', price: 8, image: 'burger.jpg' }
  ];

  const mockCartItems = {
    '1': 2,  // 2 pizzas
    '2': 1   // 1 burger
  };

  const mockContextValue = {
    food_list: mockFoodList,
    cartItems: mockCartItems,
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    getTotalCartAmount: jest.fn().mockReturnValue(28) // 2 pizzas at $10 each + 1 burger at $8
  };

  const renderWithContext = (ui, contextValue = mockContextValue) => {
    return render(
      <StoreContext.Provider value={contextValue}>
        {ui}
      </StoreContext.Provider>
    );
  };

  test('renders cart items', () => {
    renderWithContext(<Cart />);
    
    // Check if cart items are rendered
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Burger')).toBeInTheDocument();
    
    // Check if quantities are rendered
    expect(screen.getByText('2')).toBeInTheDocument(); // 2 pizzas
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 burger
  });

  test('displays correct total amount', () => {
    renderWithContext(<Cart />);
    
    // Check if total amount is displayed correctly
    expect(screen.getByText('$28')).toBeInTheDocument();
  });

  test('calls addToCart when + button is clicked', () => {
    renderWithContext(<Cart />);
    
    // Find the + button for Pizza and click it
    const addButtons = screen.getAllByText('+');
    fireEvent.click(addButtons[0]);
    
    // Check if addToCart was called with the correct item ID
    expect(mockContextValue.addToCart).toHaveBeenCalledWith('1');
  });

  test('calls removeFromCart when - button is clicked', () => {
    renderWithContext(<Cart />);
    
    // Find the - button for Pizza and click it
    const removeButtons = screen.getAllByText('-');
    fireEvent.click(removeButtons[0]);
    
    // Check if removeFromCart was called with the correct item ID
    expect(mockContextValue.removeFromCart).toHaveBeenCalledWith('1');
  });

  test('displays empty cart message when cart is empty', () => {
    const emptyCartContext = {
      ...mockContextValue,
      cartItems: {},
      getTotalCartAmount: jest.fn().mockReturnValue(0)
    };
    
    renderWithContext(<Cart />, emptyCartContext);
    
    // Check if empty cart message is displayed
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('displays checkout button when cart has items', () => {
    renderWithContext(<Cart />);
    
    // Check if checkout button is displayed
    const checkoutButton = screen.getByRole('button', { name: /checkout/i });
    expect(checkoutButton).toBeInTheDocument();
  });

  test('does not display checkout button when cart is empty', () => {
    const emptyCartContext = {
      ...mockContextValue,
      cartItems: {},
      getTotalCartAmount: jest.fn().mockReturnValue(0)
    };
    
    renderWithContext(<Cart />, emptyCartContext);
    
    // Check that checkout button is not displayed
    const checkoutButton = screen.queryByRole('button', { name: /checkout/i });
    expect(checkoutButton).not.toBeInTheDocument();
  });
});