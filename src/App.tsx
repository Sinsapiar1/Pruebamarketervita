import { useState } from 'react';
import {
  Brain,
  Key,
  CheckCircle,
  AlertTriangle,
  Search,
  Copy,
  Settings,
} from 'lucide-react';
import { ApiKeyManager } from './components/ApiKeyManager';
import { ProductDetector } from './components/ProductDetector';
import { CopyGenerator } from './components/CopyGenerator';
import { useApiKeys } from './hooks/useApiKeys';

function App() {
  const { hasValidKeys, validProviders } = useApiKeys();
  const [showApiManager, setShowApiManager] = useState(!hasValidKeys);
  const [activeModule, setActiveModule] = useState<
    'dashboard' | 'detector' | 'copy'
  >('dashboard');

  const modules = [
    {
      id: 'detector',
      name: 'Detector de Productos',
      icon: Search,
      description: 'Encuentra productos ganadores con IA',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'copy',
      name: 'Copy Generator',
      icon: Copy,
      description: 'Genera copy de alta conversión',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const handleModuleClick = (moduleId: string) => {
    if (!hasValidKeys) {
      setShowApiManager(true);
      return;
    }
    setActiveModule(moduleId as any);
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'detector':
        return <ProductDetector />;
      case 'copy':
        return <CopyGenerator />;
      default:
        return (
          <div className="space-y-8">
            {/* API Status Alert */}
            {!hasValidKeys ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">
                      ⚡ Configura tus API Keys Gratuitas
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Conecta tus credenciales personales para usar todas las
                      herramientas de IA
                    </p>
                    <button
                      onClick={() => setShowApiManager(true)}
                      className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700"
                    >
                      Configurar APIs Ahora (2 min)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">
                      🚀 APIs Configuradas Correctamente
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      {validProviders.length} proveedores listos • Todas las
                      herramientas disponibles
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            {hasValidKeys && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">APIs Conectadas</p>
                      <p className="text-2xl font-bold text-green-600">
                        {validProviders.length}/4
                      </p>
                    </div>
                    <Key className="w-8 h-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Productos Analizados
                      </p>
                      <p className="text-2xl font-bold text-gray-900">247</p>
                    </div>
                    <Search className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Copys Generados</p>
                      <p className="text-2xl font-bold text-gray-900">1,156</p>
                    </div>
                    <Copy className="w-8 h-8 text-orange-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Conversión Promedio
                      </p>
                      <p className="text-2xl font-bold text-green-600">4.2%</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => {
                const Icon = module.icon;
                const isDisabled = !hasValidKeys;

                return (
                  <div
                    key={module.id}
                    onClick={() => handleModuleClick(module.id)}
                    className={`
                      relative overflow-hidden rounded-xl p-8 transform transition-all duration-300 cursor-pointer
                      ${
                        isDisabled
                          ? 'opacity-60 cursor-not-allowed'
                          : 'hover:scale-105 hover:shadow-2xl'
                      }
                      bg-gradient-to-br ${module.color}
                    `}
                  >
                    <Icon className="w-12 h-12 text-white mb-4" />
                    <h3 className="text-white font-bold text-xl mb-2">
                      {module.name}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {module.description}
                    </p>

                    {!isDisabled && (
                      <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    )}

                    {isDisabled && (
                      <div className="absolute top-4 right-4 bg-yellow-500/80 text-white text-xs px-2 py-1 rounded flex items-center">
                        <Key className="w-3 h-3 mr-1" />
                        API
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Próximamente */}
              <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl p-8 opacity-75">
                <Settings className="w-12 h-12 text-white mb-4" />
                <h3 className="text-white font-bold text-xl mb-2">
                  Más Módulos
                </h3>
                <p className="text-white/90 text-sm">
                  Offer Validator, Trend Predictor y más...
                </p>
                <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                  Próximamente
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setActiveModule('dashboard')}
            >
              <Brain className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                MarketInsight Pro v3.0
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Tu Cuenta</p>
                <p className="text-xs text-gray-500">
                  {validProviders.length}/4 APIs • Plan Gratuito
                </p>
              </div>

              <button
                onClick={() => setShowApiManager(true)}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
              >
                <Key className="w-5 h-5 mr-2" />
                API Keys
                {hasValidKeys ? (
                  <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 ml-2 text-yellow-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeModule === 'dashboard' && (
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Herramientas de Marketing de Afiliados con IA
            </h2>
            <p className="text-gray-600 text-lg">
              Usa tus propias API keys gratuitas para generar contenido
              profesional
            </p>
          </div>
        )}

        {renderActiveModule()}
      </main>

      {/* API Key Manager Modal */}
      {showApiManager && (
        <ApiKeyManager onClose={() => setShowApiManager(false)} />
      )}
    </div>
  );
}

export default App;
