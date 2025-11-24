// services/icpService: Provide a small client-side IC mock service used by the UI.
// The real implementation should call canisters via @dfinity/agent or generated bindings.

export const icpService = {
  async getSolarEnergy() {
    await new Promise((r) => setTimeout(r, 120));
    return 420000000;
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
    await new Promise((r) => setTimeout(r, 150));
    return { id: Math.floor(Math.random() * 10000), status: 'created' };
  },
  async createProject(_title: string, _region: string, _size: number, _desc: string) {
    await new Promise((r) => setTimeout(r, 160));
    return { id: Math.floor(Math.random() * 100000), title: _title };
  }
};
