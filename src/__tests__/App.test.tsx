/// <reference types="vitest/globals" />

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Set canister ID for tests before any imports
process.env.CANISTER_ID_HHDAO = 'uxrrr-q7777-77774-qaaaq-cai';
process.env.CANISTER_ID_HHDAO_DAO = 'u6s2n-gx777-77774-qaaba-cai';
process.env.CANISTER_ID_HHDAO_DOCUMENTS = 'uzt4z-lp777-77774-qaabq-cai';
process.env.CANISTER_ID_HHDAO_FRONTEND = 'umunu-kh777-77774-qaaca-cai';
process.env.CANISTER_ID_HHDAO_IDENTITY = 'ulvla-h7777-77774-qaacq-cai';
process.env.CANISTER_ID_HHDAO_TELEMETRY = 'ucwa4-rx777-77774-qaada-cai';

beforeEach(() => {
  vi.clearAllMocks();
});

const renderWithRouter = (component: React.ReactElement, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {component}
    </MemoryRouter>
  );
};

describe('App Navigation and Routing', () => {
  beforeEach(() => {
    // jsdom is available here
    window.history.pushState({}, '', '/');
  });

  test('renders main navigation links', () => {
    renderWithRouter(<App />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  test('renders KYC page when navigated', () => {
    window.history.pushState({}, '', '/kyc');
    renderWithRouter(<App />, { route: '/kyc' });
    expect(screen.getByText(/kyc/i)).toBeInTheDocument();
  });

  test('renders NFT page when navigated', () => {
    window.history.pushState({}, '', '/nfts');
    renderWithRouter(<App />, { route: '/nfts' });
    expect(screen.getByText(/nft/i)).toBeInTheDocument();
  });
});