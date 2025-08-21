import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Login Component', () => {
  const mockSetLogin = jest.fn();
  const mockSetSignup = jest.fn();
  const mockSetToken = jest.fn();

  const mockContextValue = {
    setToken: mockSetToken
  };

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

  test('renders login form', () => {
    renderWithContext(
      <Login setLogin={mockSetLogin} setSignup={mockSetSignup} />
    );
    
    // Check if form elements are rendered
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    renderWithContext(
      <Login setLogin={mockSetLogin} setSignup={mockSetSignup} />
    );
    
    // Submit form without filling fields
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email', async () => {
    renderWithContext(
      <Login setLogin={mockSetLogin} setSignup={mockSetSignup} />
    );
    
    // Fill form with invalid email
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    // Mock successful login response
    axios.post.mockResolvedValue({
      data: {
        success: true,
        token: 'mock-token',
        message: 'Login successful'
      }
    });
    
    renderWithContext(
      <Login setLogin={mockSetLogin} setSignup={mockSetSignup} />
    );
    
    // Fill form with valid data
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    // Check if axios.post was called with correct data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          email: 'test@example.com',
          password: 'password123'
        })
      );
    });
    
    // Check if token was set and login modal was closed
    await waitFor(() => {
      expect(mockSetToken).toHaveBeenCalledWith('mock-token');
      expect(mockSetLogin).toHaveBeenCalledWith(false);
    });
  });

  test('handles login failure', async () => {
    // Mock failed login response
    axios.post.mockResolvedValue({
      data: {
        success: false,
        message: 'Invalid credentials'
      }
    });
    
    renderWithContext(
      <Login setLogin={mockSetLogin} setSignup={mockSetSignup} />
    );
    
    // Fill form with valid data
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong-password' } });
    fireEvent.click(loginButton);
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
    
    // Check that token was not set and login modal was not closed
    expect(mockSetToken).not.toHaveBeenCalled();
    expect(mockSetLogin).not.toHaveBeenCalledWith(false);
  });

  test('switches to signup form', () => {
    renderWithContext(
      <Login setLogin={mockSetLogin} setSignup={mockSetSignup} />
    );
    
    // Click on signup link
    const signupLink = screen.getByText(/sign up/i);
    fireEvent.click(signupLink);
    
    // Check if setLogin and setSignup were called correctly
    expect(mockSetLogin).toHaveBeenCalledWith(false);
    expect(mockSetSignup).toHaveBeenCalledWith(true);
  });
});