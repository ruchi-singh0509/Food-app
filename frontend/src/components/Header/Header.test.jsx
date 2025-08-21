import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

describe('Header Component', () => {
  test('renders header with title, description and button', () => {
    render(<Header />);
    
    // Check if the title is rendered
    const titleElement = screen.getByText(/Order your favourite food here/i);
    expect(titleElement).toBeInTheDocument();
    
    // Check if the description is rendered
    const descriptionElement = screen.getByText(/choose from a diverse menu/i);
    expect(descriptionElement).toBeInTheDocument();
    
    // Check if the button is rendered
    const buttonElement = screen.getByRole('button', { name: /View Menu/i });
    expect(buttonElement).toBeInTheDocument();
  });
});