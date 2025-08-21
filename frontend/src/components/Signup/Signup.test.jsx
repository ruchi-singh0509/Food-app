import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Signup from './Signup';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Signup Component', () => {
  const mockSetLogin = jest.fn();
  const mockSetSignup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders signup form', () => {
    render(<Signup setLogin={mockSetLogin} setSignup={mockSetSignup} />);
    
    // Check if form elements are rendered
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(<Signup setLogin={mockSetLogin} setSignup={mockSetSignup} />);
    
    // Submit form without filling fields
    const signupButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signupButton);
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email', async () => {
    render(<Signup setLogin={mockSetLogin} setSignup={mockSetSignup} />);
    
    // Fill form with invalid email
    const nameInput = screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const signupButton = screen.getByRole('button', { name: /sign up/i });
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signupButton);
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for weak password', async () => {
    render(<Signup setLogin={mockSetLogin} setSignup={mockSetSignup} />);
    
    // Fill form with weak password
    const nameInput = screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const signupButton = screen.getByRole('button', { name: /sign up/i });
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(signupButton);
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    // Mock successful signup response
    axios.post.mockResolvedValue({
      data: {
        success: true,
        message: 'Registration successful'
      }
    });
    
    render(<Signup setLogin={mockSetLogin} setSignup={mockSetSignup} />);
    
    // Fill form with valid data
    const nameInput = screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const signupButton = screen.getByRole('button', { name: /sign up/i });
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signupButton);
    
    // Check if axios.post was called with correct data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        })
      );
    });
    
    // Check if login modal was opened
    await waitFor(() => {
      expect(mockSetSignup).toHaveBeenCalledWith(false);
      expect(mockSetLogin).toHaveBeenCalledWith(true);
    });
  });

  test('handles signup failure', async () => {
    // Mock failed signup response
    axios.post.mockResolvedValue({
      data: {
        success: false,
        message: 'Email already exists'
      }
    });
    
    render(<Signup setLogin={mockSetLogin} setSignup={mockSetSignup} />);
    
    // Fill form with valid data
    const nameInput = screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const signupButton = screen.getByRole('button', { name: /sign up/i });
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signupButton);
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
    
    // Check that login modal was not opened
    expect(mockSetSignup).not.toHaveBeenCalledWith(false);
    expect(mockSetLogin).not.toHaveBeenCalledWith(true);
  });

  test('switches to login form', () => {
    render(<Signup setLogin={mockSetLogin} setSignup={mockSetSignup} />);
    
    // Click on login link
    const loginLink = screen.getByText(/login/i);
    fireEvent.click(loginLink);
    
    // Check if setLogin and setSignup were called correctly
    expect(mockSetSignup).toHaveBeenCalledWith(false);
    expect(mockSetLogin).toHaveBeenCalledWith(true);
  });
});