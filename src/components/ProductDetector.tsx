import {
  AlertCircle,
  Brain,
  DollarSign,
  Search,
  Star,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApiKeys } from '../hooks/useApiKeys';
import { Product } from '../types';
import { AIProviderManager } from '../utils/aiProvider';

export const ProductDetector: React.FC = () => {
  const { validProviders, apiKeys } = useApiKeys();
  const [formData, setFormData] = useState({
    nicho: '',
    publico: '',
    canal: 'facebook',
    experiencia: 'principiante',
    presupuesto: '',
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Product[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const detectProducts = async () => {
    if (validProviders.length === 0) {
      alert('Necesitas configurar al menos una API key');
      return;
    }

    setIsAnalyzing(true);

    try {
      const provider = validProviders[0]; // Usar primer proveedor disponible
      const apiKey = apiKeys[provider].key;

      const prompt = AIProviderManager.generateProductPrompt(
        formData.nicho,
        formData.publico,
        formData.canal,
        formData.presupuesto
      );

      const response = await AIProviderManager.generateWithGemini(
        prompt,
        apiKey
      );

      // Parse response - aquí parseamos la respuesta de la IA
      const products = parseProductResponse(response);
      setResults(products);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar productos. Verifica tu API key.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseProductResponse = (response: string): Product[] => {
    // Función para parsear la respuesta de la IA y convertirla en productos
    const products: Product[] = [];
    const productBlocks = response.split('=== PRODUCTO');

    productBlocks.forEach((block, index) => {
      if (index === 0) return; // Skip first empty block

      const lines = block.split('\n').filter((line) => line.trim());
      const product: Partial<Product> = { id: index };

      lines.forEach((line) => {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();

        switch (key.trim()) {
          case 'NOMBRE':
            product.nombre = value;
            break;
          case 'DESCRIPCIÓN':
            product.descripcion = value;
            break;
          case 'PRECIO':
            product.precio = value;
            break;
          case 'COMISIÓN':
            product.comision = value;
            break;
          case 'SCORE':
            product.score = parseFloat(value) || 8.5;
            break;
          case 'GRAVITY':
            product.gravity = parseFloat(value) || 120;
            break;
          case 'EPC':
            product.epc = value;
            break;
          case 'CVR':
            product.cvr = value;
            break;
          case 'PAIN_POINTS':
            product.pain_points = value.split(',').map((p) => p.trim());
            break;
          case 'EMOCIONES':
            product.emociones = value.split(',').map((e) => e.trim());
            break;
          case 'TRIGGERS':
            product.triggers = value.split(',').map((t) => t.trim());
            break;
        }
      });

      if (product.nombre) {
        products.push(product as Product);
      }
    });

    return products;
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600 bg-green-100';
    if (score >= 7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {product.nombre}
          </h3>
          <p className="text-gray-600 text-sm">{product.descripcion}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(
            product.score
          )}`}
        >
          ★ {product.score}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <DollarSign className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Precio</p>
          <p className="font-bold text-gray-900">{product.precio}</p>
        </div>

        <div className="text-center p-3 bg-green-50 rounded-lg">
          <Target className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Comisión</p>
          <p className="font-bold text-green-600">{product.comision}</p>
        </div>

        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Gravity</p>
          <p className="font-bold text-gray-900">{product.gravity}</p>
        </div>

        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <Zap className="w-6 h-6 text-orange-500 mx-auto mb-1" />
          <p className="text-sm text-gray-600">CVR</p>
          <p className="font-bold text-gray-900">{product.cvr}</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
          Pain Points
        </h4>
        <div className="flex flex-wrap gap-2">
          {product.pain_points?.map((pain, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full"
            >
              {pain}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
          <Star className="w-4 h-4 mr-2 text-yellow-500" />
          Triggers de Conversión
        </h4>
        <div className="flex flex-wrap gap-2">
          {product.triggers?.map((trigger, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full"
            >
              {trigger}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">
          Generar Copy
        </button>
        <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all">
          Calcular Profit
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Search className="mr-3 text-blue-500" />
          Detector de Productos Ganadores
        </h1>
        <p className="text-gray-600">
          Encuentra productos con alto potencial usando IA avanzada
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-6">
          Configuración de Búsqueda
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nicho Principal *
            </label>
            <input
              type="text"
              value={formData.nicho}
              onChange={(e) => handleInputChange('nicho', e.target.value)}
              placeholder="ej: fitness, trading, salud..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Público Objetivo *
            </label>
            <input
              type="text"
              value={formData.publico}
              onChange={(e) => handleInputChange('publico', e.target.value)}
              placeholder="ej: mujeres 25-45, emprendedores..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canal Principal
            </label>
            <select
              value={formData.canal}
              onChange={(e) => handleInputChange('canal', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="facebook">Facebook Ads</option>
              <option value="google">Google Ads</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="email">Email Marketing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experiencia
            </label>
            <select
              value={formData.experiencia}
              onChange={(e) => handleInputChange('experiencia', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Presupuesto Diario ($)
            </label>
            <input
              type="number"
              value={formData.presupuesto}
              onChange={(e) => handleInputChange('presupuesto', e.target.value)}
              placeholder="100"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={detectProducts}
              disabled={
                isAnalyzing ||
                !formData.nicho ||
                !formData.publico ||
                validProviders.length === 0
              }
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analizando...
                </>
              ) : (
                <>
                  <Brain className="mr-2" />
                  Detectar Productos
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Productos Detectados
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
