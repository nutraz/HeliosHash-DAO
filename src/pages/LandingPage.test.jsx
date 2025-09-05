import { render, screen } from '@testing-library/react';
import LandingPage from './LandingPage';
import { describe, it, expect } from 'vitest';

describe('LandingPage', () => {
  it('renders the hero section with the main heading', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Empowering Communities with/i)).toBeInTheDocument();
  });

  it('renders the hero section with call-to-action buttons', () => {
    render(<LandingPage />);
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Learn More/i })).toBeInTheDocument();
  });

  it('renders the features section', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Why Join HeliosHash DAO?/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Transparency/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Community-Owned/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Sustainable Returns/i })).toBeInTheDocument();
  });

  it('renders the "How It Works" section', () => {
    render(<LandingPage />);
    expect(screen.getByText(/How It Works/i)).toBeInTheDocument();
    expect(screen.getByText('Join the DAO')).toBeInTheDocument();
    expect(screen.getByText('Fund a Project')).toBeInTheDocument();
    expect(screen.getByText('Earn & Govern')).toBeInTheDocument();
  });

  it('renders the community section', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Join Our Community/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Join Discord/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Follow on Twitter/i })).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(<LandingPage />);
    expect(screen.getByText(/© \d{4} HeliosHash DAO. All Rights Reserved./i)).toBeInTheDocument();
  });
});
