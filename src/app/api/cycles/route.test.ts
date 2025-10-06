import { describe, it, expect, vi } from 'vitest';
import { GET, POST } from './route';
import { NextResponse } from 'next/server';

describe('Cycles API Route', () => {
  describe('GET /api/cycles', () => {
    it('should return cycle data successfully', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.totalCycles).toBeGreaterThan(0);
      expect(data.data.canisters).toBeInstanceOf(Array);
    });

    it('should return canister information', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(data.data.canisters.length).toBeGreaterThan(0);
      expect(data.data.canisters[0]).toHaveProperty('id');
      expect(data.data.canisters[0]).toHaveProperty('name');
      expect(data.data.canisters[0]).toHaveProperty('cycles');
      expect(data.data.canisters[0]).toHaveProperty('status');
    });

    it('should include monthly consumption data', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(data.data.monthlyConsumption).toBeDefined();
      expect(typeof data.data.monthlyConsumption).toBe('number');
    });
  });

  describe('POST /api/cycles', () => {
    it('should handle topup action', async () => {
      const request = new Request('http://localhost:3000/api/cycles', {
        method: 'POST',
        body: JSON.stringify({
          action: 'topup',
          canisterId: 'test-canister-id',
          amount: 1000000000,
        }),
      });

      const response = await POST(request);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.transactionId).toBeDefined();
    });

    it('should handle transfer action', async () => {
      const request = new Request('http://localhost:3000/api/cycles', {
        method: 'POST',
        body: JSON.stringify({
          action: 'transfer',
          canisterId: 'source-canister',
          amount: 500000000,
        }),
      });

      const response = await POST(request);
      const data = await response.json();
      
      expect(data).toBeDefined();
    });
  });
});