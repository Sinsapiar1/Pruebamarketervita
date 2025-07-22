import { useState, useEffect } from 'react';
import { ApiKeyCollection } from '../types';
import { AIProviderManager } from '../utils/aiProvider';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyCollection>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('marketinsight_api_keys');
    if (stored) {
      setApiKeys(JSON.parse(stored));
    }
  }, []);

  const updateKey = (provider: string, key: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [provider]: {
        key,
        status: key ? 'not_configured' : 'not_configured',
        provider,
      },
    }));
  };

  const testKey = async (provider: string) => {
    const keyData = apiKeys[provider];
    if (!keyData?.key) return false;

    setIsLoading(true);
    setApiKeys((prev) => ({
      ...prev,
      [provider]: { ...prev[provider], status: 'testing' },
    }));

    try {
      let isValid = false;

      if (provider === 'gemini') {
        isValid = await AIProviderManager.testGeminiKey(keyData.key);
      }

      const newStatus = isValid ? 'valid' : 'invalid';

      setApiKeys((prev) => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          status: newStatus,
        },
      }));

      if (isValid) {
        const updatedKeys = {
          ...apiKeys,
          [provider]: { ...keyData, status: 'valid' },
        };
        AIProviderManager.saveKeys(updatedKeys);
      }

      return isValid;
    } catch {
      setApiKeys((prev) => ({
        ...prev,
        [provider]: { ...prev[provider], status: 'invalid' },
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const hasValidKeys = Object.values(apiKeys).some(
    (key) => key.status === 'valid'
  );
  const validProviders = Object.entries(apiKeys)
    .filter(([_, key]) => key.status === 'valid')
    .map(([provider]) => provider);

  return {
    apiKeys,
    updateKey,
    testKey,
    hasValidKeys,
    validProviders,
    isLoading,
  };
};
