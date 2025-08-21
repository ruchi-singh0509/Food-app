import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FoodDisplay from './FoodDisplay';
import { StoreContext } from '../../context/StoreContext';

describe('FoodDisplay Component', () => {
  const mockFoodList = [
    { _id: '1', name: 'Pizza', price: 10, category: 'Main Course', image: 'pizza.jpg' },
    { _id: '2', name: 'Burger', price: 8, category: 'Main Course', image: 'burger.jpg' },
    { _id: '3', name: 'Salad', price: 6, category: 'Starters', image: 'salad.jpg' }
  ];

  const mockContextValue = {
    food_list: mockFoodList,
    addToCart: jest.fn(),
    cartItems: {},
    token: 'mock-token'
  };

  const renderWithContext = (ui, contextValue = mockContextValue) => {
    return render(
      <StoreContext.Provider value={contextValue}>
        {ui}
      </StoreContext.Provider>
    );
  };

  test('renders food items', () => {
    renderWithContext(<FoodDisplay category="All" />);
    
    // Check if all food items are rendered
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();
    
    // Check if prices are rendered
    expect(screen.getByText('$10')).toBeInTheDocument();
    expect(screen.getByText('$8')).toBeInTheDocument();
    expect(screen.getByText('$6')).toBeInTheDocument();
  });

  test('filters food items by category', () => {
    renderWithContext(<FoodDisplay category="Starters" />);
    
    // Only Salad should be rendered
    expect(screen.queryByText('Pizza')).not.toBeInTheDocument();
    expect(screen.queryByText('Burger')).not.toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();
  });

  test('adds item to cart when button is clicked', async () => {
    renderWithContext(<FoodDisplay category="All" />);
    
    // Find the first "Add to Cart" button and click it
    const addButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addButtons[0]);
    
    // Check if addToCart was called with the correct item ID
    expect(mockContextValue.addToCart).toHaveBeenCalledWith('1');
  });

  test('displays "Add to Cart" button when user is logged in', () => {
    renderWithContext(<FoodDisplay category="All" />);
    
    // Check if "Add to Cart" buttons are displayed
    const addButtons = screen.getAllByText('Add to Cart');
    expect(addButtons.length).toBe(3);
  });

  test('does not display "Add to Cart" button when user is not logged in', () => {
    const noTokenContext = {
      ...mockContextValue,
      token: ''
    };
    
    renderWithContext(<FoodDisplay category="All" />, noTokenContext);
    
    // Check that no "Add to Cart" buttons are displayed
    const addButtons = screen.queryAllByText('Add to Cart');
    expect(addButtons.length).toBe(0);
  });

  test('displays food images', () => {
    renderWithContext(<FoodDisplay category="All" />);
    
    // Check if food images are rendered
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(3);
    
    // Check alt text of images
    expect(images[0]).toHaveAttribute('alt', 'Pizza');
    expect(images[1]).toHaveAttribute('alt', 'Burger');
    expect(images[2]).toHaveAttribute('alt', 'Salad');
  });
});