
export interface ProjectNodeProps {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  status: 'live' | 'offline' | 'maintaining';
  energy: string;
  members: string;
}

export interface LiveData {
  panels: number;
  current_kW: number;
  today_kWh: number;
  uptime: string;
  temp: string;
}

export enum Tab {
  Overview = 'Overview',
  Community = 'Community',
  Opportunities = 'Opportunities',
  LiveData = 'Live Data',
}
