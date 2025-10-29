import { fireEvent, screen, waitFor } from '@testing-library/react';

export const switchTab = async (tabName: string) => {
  const tab = screen.getByRole('tab', { name: new RegExp(tabName, 'i') });
  fireEvent.click(tab);
  await waitFor(
    () => {
      switch (tabName.toLowerCase()) {
        case 'shg':
        case 'shg onboarding':
          expect(screen.getByText('SHG Bulk Onboarding')).toBeInTheDocument();
          expect(screen.getByText('Onboard SHG Members')).toBeInTheDocument();
          break;
        case 'urgam valley':
        case 'up subsidies':
          expect(screen.getByTestId('urgam-valley-pilot-dashboard')).toBeInTheDocument();
          break;
        case 'aadhaar':
        case 'aadhaar kyc':
          expect(screen.getByTestId('aadhaar-kyc-dashboard')).toBeInTheDocument();
          break;
        case 'land':
        case 'land records':
          expect(screen.getByTestId('agricultural-land-dashboard')).toBeInTheDocument();
          break;
        case 'panchayat':
          expect(screen.getByText('Gram Panchayat Status')).toBeInTheDocument();
          break;
        case 'nrega':
          expect(screen.getByText('NREGA')).toBeInTheDocument();
          break;
        default:
          // Fallback - check for any tab content
          const tabContent = screen.getByRole('tabpanel');
          expect(tabContent).toBeInTheDocument();
      }
    },
    { timeout: 2000 }
  );
  return tab;
};

// Enhanced debug function
export const debugTabState = (tabName: string) => {
  const tab = screen.getByRole('tab', { name: new RegExp(tabName, 'i') });

  console.log(`Tab "${tabName}" state:`, {
    textContent: tab.textContent,
    dataState: tab.getAttribute('data-state'),
    ariaSelected: tab.getAttribute('aria-selected'),
    className: tab.className,
    attributes: Array.from(tab.attributes).reduce(
      (acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      },
      {} as Record<string, string>
    ),
  });
  return tab;
};
