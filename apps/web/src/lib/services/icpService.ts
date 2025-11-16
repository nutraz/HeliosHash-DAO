export class ICPAuthService {
  private authenticated = false;
  private principal: string | null = null;

  async login(): Promise<boolean> {
    // TODO: integrate Internet Identity
    await new Promise((r) => setTimeout(r, 500));
    this.authenticated = true;
    this.principal = 'aaaaa-bbbbb-ccccc-xxxxx-cai';
    return true;
  }

  async logout(): Promise<void> {
    this.authenticated = false;
    this.principal = null;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getPrincipal(): string | null {
    return this.principal;
  }
}

export class ICPCanisterService {
  async getUserData(principal: string) {
    await new Promise((r) => setTimeout(r, 350));
    return {
      name: 'Rahul Kumar',
      rank: 'Investor & Collaborator',
      communityRole: 'Community Manager',
      stats: {
        projectsStarted: 3,
        projectsHelped: 12,
        membersAdded: 45,
      },
    };
  }

  async getTokenBalance(principal: string): Promise<number> {
    await new Promise((r) => setTimeout(r, 200));
    return 15000;
  }

  async transferTokens(to: string, amount: number): Promise<boolean> {
    if (amount <= 0) throw new Error('Invalid amount');
    await new Promise((r) => setTimeout(r, 500));
    return true;
  }

  async getProjects() {
    await new Promise((r) => setTimeout(r, 300));
    return [
      { id: 1, name: 'Solar Bitcoin Mining Hub', stage: 'functioning', size: '5 MW', completion: 100, funding: '₹2.5 Cr' },
      { id: 2, name: 'EV Charging Network', stage: 'tech-setup', size: '2 MW', completion: 65, funding: '₹1.2 Cr' },
    ];
  }
}
