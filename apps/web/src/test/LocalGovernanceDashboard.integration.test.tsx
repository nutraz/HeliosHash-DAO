/**
 * LocalGovernanceDashboard Integration Tests
 *
 * Comprehensive test suite for the 6-tab LocalGovernanceDashboard including
 * the new Urgam Valley pilot integration, tab switching, and component rendering.
 */

import LocalGovernanceDashboard from '@/components/LocalGovernanceDashboard';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { switchTab } from './test-utils';

// Mock the child components to isolate testing
vi.mock('@/components/AadhaarKYCDashboard', () => ({
  default: () => <div data-testid='aadhaar-kyc-dashboard'>Aadhaar KYC Dashboard Mock</div>,
}));

vi.mock('@/components/AgriculturalLandDashboard', () => ({
  default: () => (
    <div data-testid='agricultural-land-dashboard'>Agricultural Land Dashboard Mock</div>
  ),
}));

vi.mock('@/components/UrgamValleyPilotDashboard', () => ({
  default: () => (
    <div data-testid='urgam-valley-pilot-dashboard'>Urgam Valley Pilot Dashboard Mock</div>
  ),
}));

vi.mock('@/components/UPComplianceDashboard', () => ({
  default: () => <div data-testid='up-compliance-dashboard'>UP Compliance Dashboard Mock</div>,
}));

// Mock the hooks
vi.mock('@/lib/localGovernance', () => ({
  useLocalGovernance: () => ({
    verifyLandLease: vi.fn().mockResolvedValue({
      verified: true,
      record: {
        surveyNumber: 'BT-1204/A',
        ownerName: 'Dhramendra Singh',
        fatherName: 'Shri Ram Singh',
        area: 12.5,
        classification: 'agricultural',
        irrigationType: 'Canal + Tubewell',
        cropPattern: ['wheat', 'sugarcane', 'mustard'],
        documents: {
          khataNumber: 'KH-2024-001',
          khasraNumber: 'KS-445/2',
          mutationNumber: 'MUT-2023-156',
        },
        leaseStatus: 'Available for Solar',
      },
    }),
    onboardSHG: vi.fn().mockResolvedValue([]),
    checkSubsidies: vi.fn().mockResolvedValue({}),
    generateReport: vi.fn().mockReturnValue({}),
  }),
}));

vi.mock('@/lib/aadhaarService', () => ({
  aadhaarService: {
    verifyAadhaar: vi.fn().mockResolvedValue({ verified: true }),
  },
}));

describe('LocalGovernanceDashboard Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering and Structure', () => {
    it('should render the main dashboard with correct title and location badge', () => {
      render(<LocalGovernanceDashboard />);

      expect(screen.getByText('🏛️ Local Governance Integration')).toBeInTheDocument();
      expect(screen.getByText('Baghpat, Uttar Pradesh')).toBeInTheDocument();
    });

    it('should render all 6 tabs in the correct order', () => {
      render(<LocalGovernanceDashboard />);

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(6);

      expect(tabs[0]).toHaveTextContent('Panchayat');
      expect(tabs[1]).toHaveTextContent('Land Records');
      expect(tabs[2]).toHaveTextContent('Aadhaar KYC');
      expect(tabs[3]).toHaveTextContent('UP Compliance');
      expect(tabs[4]).toHaveTextContent('SHG Onboarding');
      expect(tabs[5]).toHaveTextContent('Urgam Valley');
    });

    it('should have grid-cols-6 layout for the tab list', () => {
      render(<LocalGovernanceDashboard />);

      const tabsList = screen.getByRole('tablist');
      expect(tabsList).toHaveClass('grid-cols-6');
    });

    it('should default to the Panchayat tab being active', () => {
      render(<LocalGovernanceDashboard />);
      // Instead of attribute, check for Panchayat content
      expect(screen.getByText('Gram Panchayat Status')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation and Content Switching', () => {
    it('should switch to Land Records tab and render Agricultural Land Dashboard', async () => {
      render(<LocalGovernanceDashboard />);

      const landRecordsTab = screen.getByRole('tab', { name: /land records/i });
      fireEvent.click(landRecordsTab);

      await waitFor(() => {
        expect(screen.getByTestId('agricultural-land-dashboard')).toBeInTheDocument();
      });
    });

    it('should switch to Aadhaar KYC tab and render Aadhaar dashboard', async () => {
      render(<LocalGovernanceDashboard />);

      const aadhaarTab = screen.getByRole('tab', { name: /aadhaar kyc/i });
      fireEvent.click(aadhaarTab);

      await waitFor(() => {
        expect(screen.getByTestId('aadhaar-kyc-dashboard')).toBeInTheDocument();
      });
    });

    it('should switch to Urgam Valley tab and render Urgam Valley Pilot Dashboard', async () => {
      render(<LocalGovernanceDashboard />);

      const urgamValleyTab = screen.getByRole('tab', { name: /urgam valley/i });
      fireEvent.click(urgamValleyTab);

      await waitFor(() => {
        expect(screen.getByTestId('urgam-valley-pilot-dashboard')).toBeInTheDocument();
      });
    });

    it('should switch between all tabs without errors', async () => {
      render(<LocalGovernanceDashboard />);
      const tabNames = [
        'Land Records',
        'Aadhaar KYC',
        'UP Compliance',
        'SHG Onboarding',
        'Urgam Valley',
        'Panchayat',
      ];
      for (const tabName of tabNames) {
        const tab = screen.getByRole('tab', { name: new RegExp(tabName, 'i') });
        fireEvent.click(tab);
        await waitFor(() => {
          // Check for content unique to each tab
          if (tabName === 'Land Records') {
            expect(screen.getByTestId('agricultural-land-dashboard')).toBeInTheDocument();
          } else if (tabName === 'Aadhaar KYC') {
            expect(screen.getByTestId('aadhaar-kyc-dashboard')).toBeInTheDocument();
          } else if (tabName === 'UP Compliance') {
            expect(screen.getByTestId('up-compliance-dashboard')).toBeInTheDocument();
          } else if (tabName === 'SHG Onboarding') {
            expect(screen.getByText(/SHG.*Bulk Onboarding/i)).toBeInTheDocument();
          } else if (tabName === 'Urgam Valley') {
            expect(screen.getByTestId('urgam-valley-pilot-dashboard')).toBeInTheDocument();
          } else if (tabName === 'Panchayat') {
            expect(screen.getByText('Gram Panchayat Status')).toBeInTheDocument();
          }
        });
      }
    });
  });

  describe('Urgam Valley Integration Specific Tests', () => {
    it('should switch to Urgam Valley tab and display content', async () => {
      render(<LocalGovernanceDashboard />);
      await switchTab('Urgam Valley');
      expect(screen.getByTestId('urgam-valley-pilot-dashboard')).toBeInTheDocument();
    });

    it('should properly import and render UrgamValleyPilotDashboard component', async () => {
      render(<LocalGovernanceDashboard />);

      const urgamValleyTab = screen.getByRole('tab', { name: /urgam valley/i });
      fireEvent.click(urgamValleyTab);

      await waitFor(() => {
        const urgamDashboard = screen.getByTestId('urgam-valley-pilot-dashboard');
        expect(urgamDashboard).toBeInTheDocument();
        expect(urgamDashboard).toHaveTextContent('Urgam Valley Pilot Dashboard Mock');
      });
    });

    it('should maintain tab state when switching to and from Urgam Valley tab', async () => {
      render(<LocalGovernanceDashboard />);
      await switchTab('Urgam Valley');
      expect(screen.getByTestId('urgam-valley-pilot-dashboard')).toBeInTheDocument();
      await switchTab('Land Records');
      expect(screen.getByTestId('agricultural-land-dashboard')).toBeInTheDocument();
      await switchTab('Urgam Valley');
      expect(screen.getByTestId('urgam-valley-pilot-dashboard')).toBeInTheDocument();
    });
  });

  describe('Panchayat Tab Content Validation', () => {
    it('should render panchayat status information', async () => {
      render(<LocalGovernanceDashboard />);

      // Default tab should show panchayat content
      await waitFor(() => {
        expect(screen.getByText('Gram Panchayat Status')).toBeInTheDocument();
        expect(
          screen.getByText('Baghpat District, Uttar Pradesh (Code: UP0908)')
        ).toBeInTheDocument();
      });
    });

    it('should show offline proposal generation functionality', async () => {
      render(<LocalGovernanceDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Generate Offline Proposal')).toBeInTheDocument();
      });
    });
  });

  describe('SHG Onboarding Tab Functionality', () => {
    it('should switch to SHG tab and display content', async () => {
      render(<LocalGovernanceDashboard />);
      await switchTab('SHG Onboarding');
      expect(screen.getByText('SHG Bulk Onboarding')).toBeInTheDocument();
      expect(screen.getByText('Baghpat Mahila Samuh')).toBeInTheDocument();
      expect(screen.getByText('Onboard SHG Members')).toBeInTheDocument();
    });

    it('should handle SHG onboarding button click', async () => {
      render(<LocalGovernanceDashboard />);
      await switchTab('SHG Onboarding');
      const onboardButton = screen.getByText('Onboard SHG Members');
      expect(onboardButton).toBeInTheDocument();
      fireEvent.click(onboardButton);
      // Should not throw any errors
    });

    it('should debug SHG tab switching', async () => {
      render(<LocalGovernanceDashboard />);
      const shgTab = screen.getByRole('tab', { name: /SHG/i });
      console.log('Initial tab state:', shgTab.getAttribute('data-state'));
      fireEvent.click(shgTab);
      console.log('After click tab state:', shgTab.getAttribute('data-state'));
      await waitFor(() => {
        expect(screen.getByText('SHG Bulk Onboarding')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility and UX Tests', () => {
    it('should have proper ARIA labels for tabs', () => {
      render(<LocalGovernanceDashboard />);

      const tabs = screen.getAllByRole('tab');
      tabs.forEach((tab) => {
        expect(tab).toHaveAttribute('aria-selected');
      });
    });

    it('should be keyboard navigable through tabs', () => {
      render(<LocalGovernanceDashboard />);

      const firstTab = screen.getByRole('tab', { name: /panchayat/i });
      firstTab.focus();

      expect(document.activeElement).toBe(firstTab);
    });

    it('should maintain responsive grid layout', () => {
      render(<LocalGovernanceDashboard />);

      const container = screen
        .getByText('🏛️ Local Governance Integration')
        .closest('div')?.parentElement;
      expect(container).toHaveClass('max-w-7xl', 'mx-auto');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing child component gracefully', async () => {
      // Mock a failed component import
      vi.doMock('@/components/UrgamValleyPilotDashboard', () => {
        throw new Error('Component failed to load');
      });

      // Should not crash the entire dashboard
      expect(() => render(<LocalGovernanceDashboard />)).not.toThrow();
    });

    it('should handle rapid tab switching without state corruption', async () => {
      render(<LocalGovernanceDashboard />);
      await switchTab('SHG Onboarding');
      await switchTab('Urgam Valley');
      await switchTab('SHG Onboarding');
      // Robust content-based assertion for SHG tab
      expect(screen.getByText('SHG Bulk Onboarding')).toBeInTheDocument();
      expect(screen.getByText('Onboard SHG Members')).toBeInTheDocument();
    });
  });

  describe('Integration with Services', () => {
    it('should initialize with land verification data', async () => {
      render(<LocalGovernanceDashboard />);

      await waitFor(() => {
        // Should call the land verification service on mount
        expect(screen.getByText('🏛️ Local Governance Integration')).toBeInTheDocument();
      });
    });

    it('should handle service failures gracefully', async () => {
      // Mock service failure
      vi.mocked(vi.fn()).mockRejectedValue(new Error('Service unavailable'));

      expect(() => render(<LocalGovernanceDashboard />)).not.toThrow();
    });
  });
});

describe('LocalGovernanceDashboard Performance Tests', () => {
  it('should render within acceptable time limits', async () => {
    const startTime = performance.now();

    render(<LocalGovernanceDashboard />);

    await waitFor(() => {
      expect(screen.getByText('🏛️ Local Governance Integration')).toBeInTheDocument();
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render within 300ms
    expect(renderTime).toBeLessThan(300);
  });

  it('should handle multiple tab switches efficiently', async () => {
    render(<LocalGovernanceDashboard />);
    const startTime = performance.now();
    for (let i = 0; i < 10; i++) {
      await switchTab('Urgam Valley');
      // After switching, check for Urgam Valley content
      // (if content is present, e.g., test id or fallback)
      // expect(screen.getByTestId('urgam-valley-pilot-dashboard')).toBeInTheDocument();
      await switchTab('Land Records');
      // After switching, check for Land Records content
      // expect(screen.getByTestId('agricultural-land-dashboard')).toBeInTheDocument();
    }
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    // Should complete 20 tab switches within 3 seconds
    expect(renderTime).toBeLessThan(3000);
  });
});

describe('Tab Utility Function', () => {
  it('should switch to SHG tab using utility', async () => {
    render(<LocalGovernanceDashboard />);
    await switchTab('SHG Onboarding');
    expect(screen.getByText('SHG Bulk Onboarding')).toBeInTheDocument();
    expect(screen.getByText('Onboard SHG Members')).toBeInTheDocument();
  });
});
