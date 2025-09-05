import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { describe, it, expect } from 'vitest';

describe('Navbar', () => {
  it('renders the brand name', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('HeliosHash DAO')).toBeInTheDocument();
  });

  it('renders all navigation links with correct hrefs', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Stake' })).toHaveAttribute('href', '/stake');
    expect(screen.getByRole('link', { name: 'Payments' })).toHaveAttribute('href', '/payments');
    expect(screen.getByRole('link', { name: 'KYC' })).toHaveAttribute('href', '/kyc');
    expect(screen.getByRole('link', { name: 'NFTs' })).toHaveAttribute('href', '/nfts');
  });
});
