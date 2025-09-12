import { useState, useEffect } from 'react';

export interface SolarData {
  energyProduced: number;
  bitcoinMined: number;
  efficiency: number;
  projects: number;
}

export function useSolarData() {
  const [data, setData] = useState<SolarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for now - replace with actual API calls
        const mockData: SolarData = {
          energyProduced: 1250.5,
          bitcoinMined: 0.045,
          efficiency: 87.3,
          projects: 5,
        };
        
        setData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
