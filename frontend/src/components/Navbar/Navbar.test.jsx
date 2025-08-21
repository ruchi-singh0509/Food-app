import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './Navbar';
import { StoreContext } from '../../context/StoreContext';
import { BrowserRouter } from 'react-router-dom';

// Mock the react-router-dom useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const renderWithContext = (ui, contextValues) => {
  return render(
    <StoreContext.Provider value={contextValues}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </StoreContext.Provider>
  );
};

describe('Navbar Component', () => {
  const mockContextValue = {
    getTotalCartAmount: jest.fn().mockReturnValue(50),
    token: 'mock-token',
    setToken: jest.fn(),
  };

  const mockSetLogin = jest.fn();

  test('renders navbar with logo', () => {
    renderWithContext(<Navbar setLogin={mockSetLogin} />, mockContextValue);
    
    // Check if the logo is rendered
    const logoElement = screen.getByAltText(/logo/i);
    expect(logoElement).toBeInTheDocument();
  });

  test('displays cart amount when user is logged in', () => {
    renderWithContext(<Navbar setLogin={mockSetLogin} />, mockContextValue);
    
    // Check if the cart amount is displayed
    const cartAmountElement = screen.getByText('$50');
    expect(cartAmountElement).toBeInTheDocument();
  });

  test('shows login button when user is not logged in', () => {
    const noTokenContext = {
      ...mockContextValue,
      token: '',
    };
    
    renderWithContext(<Navbar setLogin={mockSetLogin} />, noTokenContext);
    
    // Check if the login button is displayed
    const loginButton = screen.getByText(/login/i);
    expect(loginButton).toBeInTheDocument();
    
    // Test login button click
    fireEvent.click(loginButton);
    expect(mockSetLogin).toHaveBeenCalledWith(true);
  });

  test('shows profile menu when user is logged in', () => {
    renderWithContext(<Navbar setLogin={mockSetLogin} />, mockContextValue);
    
    // Check if the profile icon is displayed
    const profileIcon = screen.getByAltText(/profile/i);
    expect(profileIcon).toBeInTheDocument();
  });
});