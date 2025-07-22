import {
  CheckCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Key,
  TestTube,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApiKeys } from '../hooks/useApiKeys';

const providers = [
  {
    id: 'gemini',
    name: 'Google Gemini Pro',
    description: 'GRATIS: 60 requests/minuto',
    color: 'from-blue-500 to-blue-600',
    instructions: 'Ve a makersuite.google.com → API Key → Create API key',
    placeholder: 'AIzaSy...',
    url: 'https://makersuite.google.com/app/apikey',
  },
  {
    id: 'openai',
    name: 'OpenAI GPT-3.5',
    description: 'GRATIS: $5 inicial',
    color: 'from-green-500 to-green-600',
    instructions: 'Ve a platform.openai.com → API Keys → Create new secret key',
    placeholder: 'sk-...',
    url: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'together',
    name: 'Together.ai',
    description: 'GRATIS: $25 inicial',
    color: 'from-purple-500 to-purple-600',
    instructions: 'Ve a api.together.xyz → Settings → API Keys → New API Key',
    placeholder: 'together-...',
    url: 'https://api.together.xyz/settings/api-keys',
  },
  {
    id: 'cohere',
    name: 'Cohere Command',
    description: 'GRATIS: 1000 calls/mes',
    color: 'from-orange-500 to-orange-600',
    instructions: 'Ve a dashboard.cohere.ai → API Keys → Create API Key',
    placeholder: 'co-...',
    url: 'https://dashboard.cohere.ai/api-keys',
  },
];

interface ApiKeyManagerProps {
  onClose: () => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onClose }) => {
  const { apiKeys, updateKey, testKey, isLoading } = useApiKeys();
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  const toggleKeyVisibility = (provider: string) => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleTest = async (provider: string) => {
    await testKey(provider);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'testing':
        return (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        );
      default:
        return <Key className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                🚀 Configurar API Keys Gratuitas
              </h2>
              <p className="text-blue-100">
                Conecta tus credenciales personales para usar IA gratis
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${provider.color} flex items-center justify-center text-white font-bold mr-4`}
                    >
                      🤖
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{provider.name}</h3>
                      <p className="text-sm text-gray-600">
                        {provider.description}
                      </p>
                    </div>
                  </div>
                  {getStatusIcon(
                    apiKeys[provider.id]?.status || 'not_configured'
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                  <div className="flex items-start">
                    <div className="text-blue-500 mr-2">💡</div>
                    <div>
                      <p className="text-sm text-blue-800 font-medium">
                        Cómo obtener:
                      </p>
                      <p className="text-sm text-blue-700">
                        {provider.instructions}
                      </p>
                      <a
                        href={provider.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
                      >
                        Ir al sitio web
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKeys[provider.id] ? 'text' : 'password'}
                      value={apiKeys[provider.id]?.key || ''}
                      onChange={(e) => updateKey(provider.id, e.target.value)}
                      placeholder={provider.placeholder}
                      className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => toggleKeyVisibility(provider.id)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeys[provider.id] ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => handleTest(provider.id)}
                    disabled={!apiKeys[provider.id]?.key || isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {apiKeys[provider.id]?.status === 'testing' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <TestTube className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="mt-3 text-center">
                  {apiKeys[provider.id]?.status === 'valid' && (
                    <span className="text-green-600 text-sm font-medium">
                      ✅ API Key Válida
                    </span>
                  )}
                  {apiKeys[provider.id]?.status === 'invalid' && (
                    <span className="text-red-600 text-sm font-medium">
                      ❌ API Key Inválida
                    </span>
                  )}
                  {apiKeys[provider.id]?.status === 'testing' && (
                    <span className="text-blue-600 text-sm font-medium">
                      🔄 Probando...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-medium">
                🔒 Tus API keys se guardan localmente en tu navegador
              </p>
              <p className="text-green-700 text-sm mt-1">
                ✅ No dependes de terceros • 💰 Usas tus cuotas gratuitas • 🚀
                Control total
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
