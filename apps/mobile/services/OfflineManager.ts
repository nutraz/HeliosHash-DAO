
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

export interface OfflineAction {
  id: number;
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  timestamp: Date;
  retries: number;
}

export class OfflineManager {
  pendingActions: OfflineAction[] = [];
  isOnline: boolean = true;

  constructor() {
    this.setupEventListeners();
    this.loadFromStorage();
  }

  setupEventListeners() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? true;
      if (this.isOnline) {
        this.processQueue();
      }
    });
  }

  async queueAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retries'>) {
    try {
      this.pendingActions.push({
        ...action,
        id: Date.now(),
        timestamp: new Date(),
        retries: 0
      });
      await this.saveToStorage();
      if (this.isOnline) {
        this.processQueue();
      }
    } catch (error) {
      this.handleError('Failed to queue action', error);
    }
  }

  async processQueue() {
    try {
      while (this.pendingActions.length > 0 && this.isOnline) {
        const action = this.pendingActions[0];
        try {
          await this.executeAction(action);
          this.pendingActions.shift();
          await this.saveToStorage();
        } catch (error) {
          action.retries++;
          if (action.retries >= 3) {
            // Optionally move to failed actions
            this.handleError('Action failed after 3 retries', error);
          }
          break;
        }
      }
    } catch (error) {
      this.handleError('Failed to process queue', error);
    }
  }

  async executeAction(action: OfflineAction) {
    try {
      const response = await fetch(action.url, {
        method: action.method,
        headers: action.headers,
        body: action.body
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    } catch (error) {
      this.handleError('Failed to execute action', error);
      throw error;
    }
  }

  async saveToStorage() {
    try {
      await AsyncStorage.setItem('pendingActions', JSON.stringify(this.pendingActions));
    } catch (error) {
      this.handleError('Failed to save pending actions', error);
    }
  }

  async loadFromStorage() {
    try {
      const data = await AsyncStorage.getItem('pendingActions');
      if (data) {
        this.pendingActions = JSON.parse(data);
      }
    } catch (error) {
      this.handleError('Failed to load pending actions', error);
    }
  }

  handleError(context: string, error: any) {
    // Log to console, show alert, and optionally send to monitoring service
    console.error(`[OfflineManager] ${context}:`, error);
    Alert.alert('Error', `${context}: ${error?.message || error}`);
    // TODO: Integrate with Sentry or remote logging
  }

// Optional: React Native error boundary for UI components
}

// Use ErrorBoundary from mobile/components/ErrorBoundary
