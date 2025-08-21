import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Checkout from './Checkout';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock Stripe
jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: () => ({
    createPaymentMethod: jest.fn().mockResolvedValue({
      paymentMethod: { id: 'pm_123456789' }
    })
  }),
  useElements: () => ({
    getElement: jest.fn()
  }),
  CardElement: () => <div data-testid="card-element" />
}));

describe('Checkout Component', () => {
  const mockCartItems = {
    '1': 2,  // 2 pizzas
    '2': 1   // 1 burger
  };

  const mockContextValue = {
    cartItems: mockCartItems,
    getTotalCartAmount: jest.fn().mockReturnValue(28), // 2 pizzas at $10 each + 1 burger at $8
    clearCart: jest.fn()
  };

  const mockSetShowCheckout = jest.fn();

  const renderWithContext = (ui, contextValue = mockContextValue) => {
    return render(
      <StoreContext.Provider value={contextValue}>
        {ui}
      </StoreContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders checkout form', () => {
    renderWithContext(
      <Checkout setShowCheckout={mockSetShowCheckout} />
    );
    
    // Check if form elements are rendered
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/city/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/state/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/zip code/i)).toBeInTheDocument();
    expect(screen.getByTestId('card-element')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pay \$28/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    renderWithContext(
      <Checkout setShowCheckout={mockSetShowCheckout} />
    );
    
    // Submit form without filling fields
    const payButton = screen.getByRole('button', { name: /pay \$28/i });
    fireEvent.click(payButton);
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/city is required/i)).toBeInTheDocument();
      expect(screen.getByText(/state is required/i)).toBeInTheDocument();
      expect(screen.getByText(/zip code is required/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    // Mock successful payment response
    axios.post.mockResolvedValue({
      data: {
        success: true,
        message: 'Payment successful'
      }
    });
    
    renderWithContext(
      <Checkout setShowCheckout={mockSetShowCheckout} />
    );
    
    // Fill form with valid data
    const nameInput = screen.getByPlaceholderText(/name/i);
    const addressInput = screen.getByPlaceholderText(/address/i);
    const cityInput = screen.getByPlaceholderText(/city/i);
    const stateInput = screen.getByPlaceholderText(/state/i);
    const zipInput = screen.getByPlaceholderText(/zip code/i);
    const payButton = screen.getByRole('button', { name: /pay \$28/i });
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(addressInput, { target: { value: '123 Main St' } });
    fireEvent.change(cityInput, { target: { value: 'Anytown' } });
    fireEvent.change(stateInput, { target: { value: 'CA' } });
    fireEvent.change(zipInput, { target: { value: '12345' } });
    fireEvent.click(payButton);
    
    // Check if axios.post was called with correct data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          amount: 28,
          paymentMethodId: 'pm_123456789',
          name: 'Test User',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
          items: mockCartItems
        })
      );
    });
    
    // Check if cart was cleared and checkout was closed
    await waitFor(() => {
      expect(mockContextValue.clearCart).toHaveBeenCalled();
      expect(mockSetShowCheckout).toHaveBeenCalledWith(false);
    });
  });

  test('handles payment failure', async () => {
    // Mock failed payment response
    axios.post.mockResolvedValue({
      data: {
        success: false,
        message: 'Payment failed'
      }
    });
    
    renderWithContext(
      <Checkout setShowCheckout={mockSetShowCheckout} />
    );
    
    // Fill form with valid data
    const nameInput = screen.getByPlaceholderText(/name/i);
    const addressInput = screen.getByPlaceholderText(/address/i);
    const cityInput = screen.getByPlaceholderText(/city/i);
    const stateInput = screen.getByPlaceholderText(/state/i);
    const zipInput = screen.getByPlaceholderText(/zip code/i);
    const payButton = screen.getByRole('button', { name: /pay \$28/i });
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(addressInput, { target: { value: '123 Main St' } });
    fireEvent.change(cityInput, { target: { value: 'Anytown' } });
    fireEvent.change(stateInput, { target: { value: 'CA' } });
    fireEvent.change(zipInput, { target: { value: '12345' } });
    fireEvent.click(payButton);
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
    });
    
    // Check that cart was not cleared and checkout was not closed
    expect(mockContextValue.clearCart).not.toHaveBeenCalled();
    expect(mockSetShowCheckout).not.toHaveBeenCalledWith(false);
  });

  test('closes checkout when cancel button is clicked', () => {
    renderWithContext(
      <Checkout setShowCheckout={mockSetShowCheckout} />
    );
    
    // Click on cancel button
    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);
    
    // Check if checkout was closed
    expect(mockSetShowCheckout).toHaveBeenCalledWith(false);
  });
});