// services/icpService: Provide a small client-side IC mock service used by the UI.
// The real implementation should call canisters via @dfinity/agent or generated bindings.

import { isDemoMode } from "../lib/demoMode";

// H16a: the "action" methods below are mocks that return fabricated ids/receipts.
// Outside DEMO MODE (production default) they must NOT pretend an on-chain action
// succeeded — they throw a "coming soon" error so the UI surfaces honest state.
const COMING_SOON = "This action is not yet available — coming soon.";

export const icpService = {
  async getSolarEnergy() {
    await new Promise((r) => setTimeout(r, 120));
    // Demo value in MWh/year: ~1,200 panels x 0.4 kW x 1,500 kWh/kWp/yr ≈ 720 MWh/yr.
    return 720;
  },
  async getPanelCount() {
    await new Promise((r) => setTimeout(r, 80));
    return 1200;
  },
  async getLocation() {
    await new Promise((r) => setTimeout(r, 40));
    return 'Baghpat, Uttar Pradesh, India';
  },
  async getProjectStats(_projectId: string) {
    await new Promise((r) => setTimeout(r, 120));
    return { activeProposals: 3, treasury: '1.2M HHD' };
  },
  async createOpportunity(_projectId: string, _type: string, _desc: string) {
    if (!isDemoMode()) throw new Error(COMING_SOON);
    await new Promise((r) => setTimeout(r, 150));
    return { id: Math.floor(Math.random() * 10000), status: 'created' };
  },
  async createProject(_title: string, _region: string, _size: number, _desc: string) {
    if (!isDemoMode()) throw new Error(COMING_SOON);
    await new Promise((r) => setTimeout(r, 160));
    return { id: Math.floor(Math.random() * 100000), title: _title };
  },
  async transferTokens(_recipient: string, _amount: number) {
    if (!isDemoMode()) throw new Error(COMING_SOON);
    // simulate network delay and return a mock transfer receipt
    await new Promise((r) => setTimeout(r, 140));
    return { ok: true, txId: `tx_${Date.now()}_${Math.floor(Math.random() * 10000)}` };
  },
  async createSocialPost(_content: string) {
    if (!isDemoMode()) throw new Error(COMING_SOON);
    await new Promise((r) => setTimeout(r, 120));
    return { ok: Math.floor(Math.random() * 100000), content: _content };
  }
};
