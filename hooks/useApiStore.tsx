"use client"

import { create } from 'zustand'

interface ApiKeysState {
  apiKeys: {
    openai_api_key: string | null;
    anthropic_api_key: string | null;
    google_generative_ai_api_key: string | null;
  };
  setApiKeys: (keys: any) => void;
  getKey: (provider: 'openai' | 'anthropic' | 'google') => string | null;
}

// Initialize with localStorage values if available
const getInitialKeys = () => {
  if (typeof window !== 'undefined') {
    const storedKeys = localStorage.getItem('apiKeys');
    if (storedKeys) {
      return JSON.parse(storedKeys);
    }
  }
  
  return {
    openai_api_key: null,
    anthropic_api_key: null,
    google_generative_ai_api_key: null
  };
}

export const useApiStore = create<ApiKeysState>((set, get) => ({
  apiKeys: getInitialKeys(),
  setApiKeys: (keys) => set({ apiKeys: keys }),
  getKey: (provider) => {
    const { apiKeys } = get();
    
    switch(provider) {
      case 'openai':
        return apiKeys.openai_api_key;
      case 'anthropic':
        return apiKeys.anthropic_api_key;
      case 'google':
        return apiKeys.google_generative_ai_api_key;
      default:
        return null;
    }
  }
}));