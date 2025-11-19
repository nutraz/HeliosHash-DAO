/**
 * API Mocking System for HeliosHash DAO
 * Provides comprehensive mocking for external dependencies
 */

import { Page, Request, Route } from '@playwright/test';
import { TestDataFactory } from '../factories/test-data-factory';

// Types for mock responses
export interface MockCanisterResponse {
  status: 'success' | 'error';
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface MockWalletConnection {
  isConnected: boolean;
  principal?: string;
  accountId?: string;
  balance?: number;
}

export interface MockCanisterCall {
  canister: string;
  method: string;
  args?: any[];
  response: MockCanisterResponse;
  delay?: number;
}

/**
 * Internet Computer Canister Mocker
 */
export class CanisterMocker {
  private mockCalls: Map<string, MockCanisterResponse> = new Map();
  private callHistory: Array<{ canister: string; method: string; args: any[]; timestamp: Date }> =
    [];

  /**
   * Register a mock response for a specific canister method
   */
  addMockCall(
    canister: string,
    method: string,
    response: MockCanisterResponse,
    args?: any[]
  ): void {
    const key = this.generateCallKey(canister, method, args);
    this.mockCalls.set(key, response);
  }

  /**
   * Setup mock responses for micro_grants canister
   */
  setupMicroGrantsMocks(): void {
    // Health check
    this.addMockCall('micro_grants', 'healthCheck', {
      status: 'success',
      data: true,
    });

    // System health
    this.addMockCall('micro_grants', 'getSystemHealth', {
      status: 'success',
      data: {
        overallStatus: { Healthy: null },
        components: [
          { name: 'applications', status: { Healthy: null }, lastCheck: Date.now() * 1000000 },
          { name: 'budget', status: { Healthy: null }, lastCheck: Date.now() * 1000000 },
        ],
        uptime: 86400000000000, // 24 hours in nanoseconds
        version: '2.1.0',
      },
    });

    // Submit application - success
    this.addMockCall('micro_grants', 'submitApplication', {
      status: 'success',
      data: { ok: 123 },
    });

    // Submit application - validation error
    this.addMockCall(
      'micro_grants',
      'submitApplication',
      {
        status: 'error',
        error: {
          code: 'InvalidInput',
          message: 'Title cannot be empty',
          details: { field: 'title', code: 4001 },
        },
      },
      [null, true, null, '', null, null, null, null, []]
    );

    // Get application
    this.addMockCall(
      'micro_grants',
      'getApplication',
      {
        status: 'success',
        data: {
          ok: {
            id: 123,
            title: 'Test Application',
            description: 'Test Description',
            status: { Pending: null },
            createdAt: Date.now() * 1000000,
          },
        },
      },
      [123]
    );

    // Get canister metrics
    this.addMockCall('micro_grants', 'getCanisterMetrics', {
      status: 'success',
      data: {
        totalApplications: 42,
        approvedApplications: 15,
        rejectedApplications: 3,
        totalAmountRequested: 2500000,
        totalAmountApproved: 750000,
        averageProcessingTime: 7200000000000, // 2 hours in nanoseconds
        lastUpdated: Date.now() * 1000000,
        version: '2.1.0',
      },
    });
  }

  /**
   * Setup mock responses for women's incentive canister
   */
  setupWomensIncentiveMocks(): void {
    this.addMockCall('womens_incentive', 'processTierPurchase', {
      status: 'success',
      data: { ok: null },
    });

    this.addMockCall('womens_incentive', 'getTokenBalance', {
      status: 'success',
      data: 5000,
    });

    this.addMockCall('womens_incentive', 'healthCheck', {
      status: 'success',
      data: true,
    });
  }

  /**
   * Setup mock responses for DAO canister
   */
  setupDAOMocks(): void {
    // Get all proposals
    this.addMockCall('hhdao_dao', 'getAllProposals', {
      status: 'success',
      data: [
        {
          id: 1,
          title: "Increase Women's Grant Funding",
          description: 'Proposal to increase funding allocation for women-led initiatives',
          status: { Active: null },
          votesFor: 150,
          votesAgainst: 25,
          createdAt: Date.now() * 1000000,
        },
      ],
    });

    // Submit proposal
    this.addMockCall('hhdao_dao', 'submitProposal', {
      status: 'success',
      data: { ok: 2 },
    });

    // Vote on proposal
    this.addMockCall('hhdao_dao', 'vote', {
      status: 'success',
      data: { ok: null },
    });
  }

  /**
   * Setup performance-focused mocks with delays
   */
  setupPerformanceMocks(): void {
    // Slow response simulation
    this.addMockCall('micro_grants', 'getApplications', {
      status: 'success',
      data: TestDataFactory.Application.createBatch(100, 'women'),
    });

    // High load simulation
    this.addMockCall('micro_grants', 'submitBulkApplications', {
      status: 'success',
      data: { processedCount: 50, failedCount: 0 },
    });
  }

  /**
   * Setup security-focused mocks
   */
  setupSecurityMocks(): void {
    // Unauthorized access
    this.addMockCall('micro_grants', 'adminFunction', {
      status: 'error',
      error: {
        code: 'Unauthorized',
        message: 'Admin privileges required',
        details: { requiredRole: 'admin', currentRole: 'user' },
      },
    });

    // XSS attempt detection
    this.addMockCall('micro_grants', 'submitApplication', {
      status: 'error',
      error: {
        code: 'InvalidInput',
        message: 'Malicious content detected in title',
        details: { field: 'title', reason: 'XSS_DETECTED' },
      },
    });
  }

  /**
   * Generate call key for mapping
   */
  private generateCallKey(canister: string, method: string, args?: any[]): string {
    const argsString = args ? JSON.stringify(args) : '';
    return `${canister}.${method}:${argsString}`;
  }

  /**
   * Get mock response for a call
   */
  getMockResponse(canister: string, method: string, args?: any[]): MockCanisterResponse | null {
    const key = this.generateCallKey(canister, method, args);
    const exactMatch = this.mockCalls.get(key);

    if (exactMatch) {
      this.recordCall(canister, method, args || []);
      return exactMatch;
    }

    // Try without args for general mocks
    const generalKey = this.generateCallKey(canister, method);
    const generalMatch = this.mockCalls.get(generalKey);

    if (generalMatch) {
      this.recordCall(canister, method, args || []);
      return generalMatch;
    }

    return null;
  }

  /**
   * Record call for debugging
   */
  private recordCall(canister: string, method: string, args: any[]): void {
    this.callHistory.push({
      canister,
      method,
      args,
      timestamp: new Date(),
    });
  }

  /**
   * Get call history for debugging
   */
  getCallHistory(): Array<{ canister: string; method: string; args: any[]; timestamp: Date }> {
    return [...this.callHistory];
  }

  /**
   * Clear all mocks and history
   */
  clear(): void {
    this.mockCalls.clear();
    this.callHistory.length = 0;
  }
}

/**
 * Wallet Connection Mocker
 */
export class WalletMocker {
  private connectionState: MockWalletConnection = {
    isConnected: false,
  };

  /**
   * Setup connected wallet state
   */
  setConnected(state: Partial<MockWalletConnection> = {}): void {
    this.connectionState = {
      isConnected: true,
      principal: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
      accountId: '2vxsx-fae',
      balance: 1000000,
      ...state,
    };
  }

  /**
   * Setup disconnected state
   */
  setDisconnected(): void {
    this.connectionState = {
      isConnected: false,
    };
  }

  /**
   * Get current mock state
   */
  getState(): MockWalletConnection {
    return { ...this.connectionState };
  }

  /**
   * Setup mock wallet in browser context
   */
  async setupInPage(page: Page): Promise<void> {
    await page.addInitScript((mockState) => {
      // Mock IC agent
      (window as any).ic = {
        plug: {
          requestConnect: async () => mockState.isConnected,
          createAgent: async () => ({
            getPrincipal: () => mockState.principal,
            call: async (canisterId: string, options: any) => {
              // Simulate canister call
              return { success: true, data: null };
            },
          }),
          isConnected: () => mockState.isConnected,
          disconnect: async () => {
            mockState.isConnected = false;
          },
          accountId: mockState.accountId,
          balance: mockState.balance,
        },

        // Mock dfinity agent
        agent: {
          HttpAgent: class {
            async call() {
              return { success: true };
            }
            async status() {
              return { replica_health_status: 'healthy' };
            }
          },
          Actor: {
            createActor: () => ({
              // Mock canister methods
              healthCheck: () => Promise.resolve(true),
              submitApplication: () => Promise.resolve({ ok: 123 }),
              getApplication: () => Promise.resolve({ ok: { id: 123, title: 'Mock' } }),
            }),
          },
        },
      };

      // Mock window.dfinity for alternative wallet connections
      (window as any).dfinity = {
        createActor: () => ({
          healthCheck: () => Promise.resolve(true),
        }),
      };
    }, this.connectionState);
  }
}

/**
 * HTTP API Mocker
 */
export class HTTPMocker {
  private routes: Map<string, any> = new Map();

  /**
   * Add mock HTTP response
   */
  addRoute(pattern: string | RegExp, response: any, status: number = 200): void {
    this.routes.set(pattern.toString(), { response, status });
  }

  /**
   * Setup common API mocks
   */
  setupCommonAPIs(): void {
    // Health check endpoint
    this.addRoute('/api/health', {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });

    // Status endpoint
    this.addRoute('/api/status', {
      server: 'running',
      database: 'connected',
      canisters: 'healthy',
    });

    // Mock external APIs
    this.addRoute('/api/external/weather', {
      temperature: 25,
      conditions: 'sunny',
      solarRadiation: 'high',
    });

    // Mock error responses
    this.addRoute('/api/error/500', { error: 'Internal Server Error', code: 500 }, 500);
  }

  /**
   * Apply mocks to page
   */
  async applyToPage(page: Page): Promise<void> {
    await page.route('**/*', (route: Route, request: Request) => {
      const url = request.url();

      for (const [pattern, mockData] of this.routes) {
        const regex = new RegExp(pattern.replace(/^\//g, '').replace(/\/$/g, ''));
        if (regex.test(url)) {
          route.fulfill({
            status: mockData.status,
            contentType: 'application/json',
            body: JSON.stringify(mockData.response),
          });
          return;
        }
      }

      // Continue with original request if no mock found
      route.continue();
    });
  }

  /**
   * Clear all routes
   */
  clear(): void {
    this.routes.clear();
  }
}

/**
 * Performance Mocker - Simulate network conditions
 */
export class PerformanceMocker {
  /**
   * Setup slow network conditions
   */
  static async setupSlowNetwork(page: Page): Promise<void> {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 50 * 1024, // 50 KB/s
      uploadThroughput: 20 * 1024, // 20 KB/s
      latency: 200, // 200ms latency
    });
  }

  /**
   * Setup fast network conditions
   */
  static async setupFastNetwork(page: Page): Promise<void> {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 10 * 1024 * 1024, // 10 MB/s
      uploadThroughput: 5 * 1024 * 1024, // 5 MB/s
      latency: 10, // 10ms latency
    });
  }

  /**
   * Setup offline conditions
   */
  static async setupOffline(page: Page): Promise<void> {
    await page.context().setOffline(true);
  }
}

/**
 * Comprehensive Mock Manager
 */
export class MockManager {
  private canisterMocker = new CanisterMocker();
  private walletMocker = new WalletMocker();
  private httpMocker = new HTTPMocker();

  /**
   * Setup all mocks for smoke tests
   */
  async setupSmokeTestMocks(page: Page): Promise<void> {
    this.canisterMocker.setupMicroGrantsMocks();
    this.walletMocker.setConnected();
    this.httpMocker.setupCommonAPIs();

    await this.walletMocker.setupInPage(page);
    await this.httpMocker.applyToPage(page);
  }

  /**
   * Setup all mocks for integration tests
   */
  async setupIntegrationTestMocks(page: Page): Promise<void> {
    this.canisterMocker.setupMicroGrantsMocks();
    this.canisterMocker.setupWomensIncentiveMocks();
    this.canisterMocker.setupDAOMocks();
    this.walletMocker.setConnected();
    this.httpMocker.setupCommonAPIs();

    await this.walletMocker.setupInPage(page);
    await this.httpMocker.applyToPage(page);
  }

  /**
   * Setup all mocks for performance tests
   */
  async setupPerformanceTestMocks(page: Page): Promise<void> {
    this.canisterMocker.setupMicroGrantsMocks();
    this.canisterMocker.setupPerformanceMocks();
    this.walletMocker.setConnected();

    await this.walletMocker.setupInPage(page);
    await PerformanceMocker.setupSlowNetwork(page);
  }

  /**
   * Setup all mocks for security tests
   */
  async setupSecurityTestMocks(page: Page): Promise<void> {
    this.canisterMocker.setupMicroGrantsMocks();
    this.canisterMocker.setupSecurityMocks();
    this.walletMocker.setDisconnected(); // Start disconnected for security tests
    this.httpMocker.setupCommonAPIs();

    await this.walletMocker.setupInPage(page);
    await this.httpMocker.applyToPage(page);
  }

  /**
   * Get all mockers for advanced usage
   */
  getMockers() {
    return {
      canister: this.canisterMocker,
      wallet: this.walletMocker,
      http: this.httpMocker,
    };
  }

  /**
   * Clear all mocks
   */
  clearAll(): void {
    this.canisterMocker.clear();
    this.httpMocker.clear();
  }
}

export default MockManager;
