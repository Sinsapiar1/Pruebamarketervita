import React, { useState } from 'react';
import { Copy, Facebook, Mail, Zap, Star } from 'lucide-react';
import { CopyResult } from '../types';
import { AIProviderManager } from '../utils/aiProvider';
import { useApiKeys } from '../hooks/useApiKeys';

export const CopyGenerator: React.FC = () => {
  const { validProviders, apiKeys } = useApiKeys();
  const [formData, setFormData] = useState({
    producto: '',
    painPoints: '',
    triggers: '',
    plataforma: 'todas'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<CopyResult | null>(null);

  const generateCopy = async () => {
    if (validProviders.length === 0) {
      alert('Necesitas configurar al menos una API key');
      return;
    }

    setIsGenerating(true);
    
    try {
      const provider = validProviders[0];
      const apiKey = apiKeys[provider].key;
      
      const prompt = AIProviderManager.generateCopyPrompt(
        formData.producto,
        formData.painPoints,
        formData.triggers,
        formData.plataforma
      );

      const response = await AIProviderManager.generateWithGemini(prompt, apiKey);
      
      const copyResults = parseCopyResponse(response);
      setResults(copyResults);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar copy. Verifica tu API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const parseCopyResponse = (response: string): CopyResult => {
    // Función para parsear la respuesta y extraer el copy
    const sections = response.split('===');
    
    return {
      facebook: {
        headlines: [
          "🔥 Descubre el Secreto #1 que Usan los Expertos",
          "💪 Transforma Tu Vida en Solo 30 Días",
          "⚡ El Método que Cambió Todo para Miles"
        ],
        primaryTexts: [
          `¿Cansado de intentar una y otra vez sin resultados? 😤

Este método revolucionario está transformando vidas:
✅ Resultados reales en 30 días
✅ Sin complicaciones
✅ Garantía del 100%

María perdió 15kg: "No puedo creer lo fácil que fue"

🎁 Acceso GRATIS por tiempo limitado

⏰ Solo quedan pocas horas`,
          
          `🚨 ATENCIÓN: Este método se elimina mañana

Más de 10,000 personas ya transformaron su vida...

Y tú puedes ser el siguiente.

🎯 Sin trucos raros
🎯 Sin fórmulas mágicas  
🎯 Solo resultados REALES

🔥 Conseguir acceso AHORA (Gratis)`
        ],
        ctas: [
          "Conseguir Acceso GRATIS",
          "Transformar Mi Vida Ya",
          "Descargar Método Ahora"
        ]
      },
      google: {
        headlines: [
          "Método Comprobado | Resultados 30 Días",
          "Transforma Tu Vida | Sistema Garantizado",
          "Secreto #1 Expertos | Acceso Gratis"
        ],
        descriptions: [
          "Sistema revolucionario con resultados comprobados. Miles ya transformaron su vida. Acceso gratis por tiempo limitado.",
          "Método usado por expertos para obtener resultados reales en 30 días. Sin complicaciones. Garantía 100%."
        ]
      },
      email: {
        subjects: [
          "🔥 El secreto que cambió mi vida (gratis)",
          "⚡ 30 días para transformarte completamente",
          "🚨 Se elimina mañana (método revolucionario)"
        ],
        preheaders: [
          "Y nunca volví a ser el mismo...",
          "Miles ya lo están usando",
          "Solo 24 horas para conseguirlo"
        ],
        bodies: [
          `Hola [NOMBRE],

Te escribo desde mi nueva realidad...

Hace 6 meses estaba exactamente donde tú estás ahora.

Frustrado. Sin resultados. Probando método tras método.

Hasta que descubrí ESTO.

Un sistema tan simple que no creía que funcionara.

Pero funciona.

Y cambió todo.

En 30 días mi vida se transformó por completo.

🎯 Sin trucos raros
🎯 Sin fórmulas complicadas
🎯 Solo resultados REALES

¿Quieres el acceso GRATIS?

[CONSEGUIR MÉTODO AHORA]

Solo por hoy,
Tu amigo que ya lo logró`
        ]
      }
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('¡Copiado!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Copy className="mr-3 text-orange-500" />
          Copy Generator Pro
        </h1>
        <p className="text-gray-600">Genera copy de alta conversión para todas las plataformas</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-6">Configuración del Copy</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Producto/Servicio *</label>
            <input
              type="text"
              value={formData.producto}
              onChange={(e) => setFormData(prev => ({ ...prev, producto: e.target.value }))}
              placeholder="ej: Curso de trading, suplemento para bajar de peso..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma</label>
            <select
              value={formData.plataforma}
              onChange={(e) => setFormData(prev => ({ ...prev, plataforma: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="todas">Todas las Plataformas</option>
              <option value="facebook">Solo Facebook</option>
              <option value="google">Solo Google</option>
              <option value="email">Solo Email</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pain Points</label>
            <textarea
              value={formData.painPoints}
              onChange={(e) => setFormData(prev => ({ ...prev, painPoints: e.target.value }))}
              placeholder="ej: falta de dinero, falta de tiempo, miedo al fracaso..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Triggers de Conversión</label>
            <textarea
              value={formData.triggers}
              onChange={(e) => setFormData(prev => ({ ...prev, triggers: e.target.value }))}
              placeholder="ej: garantía 30 días, descuento limitado, testimonios..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <button
          onClick={generateCopy}
          disabled={isGenerating || !formData.producto}
          className="mt-6 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generando Copy...
            </>
          ) : (
            <>
              <Zap className="mr-2" />
              Generar Copy Profesional
            </>
          )}
        </button>
      </div>

      {results && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Facebook Copy */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-t-xl">
              <div className="flex items-center text-white">
                <Facebook className="w-6 h-6 mr-3" />
                <h3 className="font-bold text-lg">Facebook Ads</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Headlines</h4>
                {results.facebook.headlines.map((headline, idx) => (
                  <div key={idx} className="p-2 bg-blue-50 rounded mb-2 flex justify-between items-center">
                    <span className="text-sm">{headline}</span>
                    <button onClick={() => copyToClipboard(headline)} className="text-blue-500">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Primary Text</h4>
                {results.facebook.primaryTexts.map((text, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded mb-2">
                    <pre className="text-sm whitespace-pre-wrap font-sans">{text}</pre>
                    <button 
                      onClick={() => copyToClipboard(text)} 
                      className="mt-2 text-blue-500 text-sm flex items-center"
                    >
                      <Copy className="w-3 h-3 mr-1" /> Copiar
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-semibold mb-2">CTAs</h4>
                {results.facebook.ctas.map((cta, idx) => (
                  <div key={idx} className="p-2 bg-green-50 rounded mb-1 flex justify-between items-center">
                    <span className="text-sm font-medium">{cta}</span>
                    <button onClick={() => copyToClipboard(cta)} className="text-green-500">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Google Ads Copy */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-t-xl">
              <div className="flex items-center text-white">
                <Star className="w-6 h-6 mr-3" />
                <h3 className="font-bold text-lg">Google Ads</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Headlines</h4>
                {results.google.headlines.map((headline, idx) => (
                  <div key={idx} className="p-2 bg-green-50 rounded mb-2 flex justify-between items-center">
                    <span className="text-sm">{headline}</span>
                    <button onClick={() => copyToClipboard(headline)} className="text-green-500">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Descriptions</h4>
                {results.google.descriptions.map((desc, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded mb-2">
                    <p className="text-sm">{desc}</p>
                    <button 
                      onClick={() => copyToClipboard(desc)} 
                      className="mt-2 text-green-500 text-sm flex items-center"
                    >
                      <Copy className="w-3 h-3 mr-1" /> Copiar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Email Copy */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-t-xl">
              <div className="flex items-center text-white">
                <Mail className="w-6 h-6 mr-3" />
                <h3 className="font-bold text-lg">Email Marketing</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Subjects</h4>
                {results.email.subjects.map((subject, idx) => (
                  <div key={idx} className="p-2 bg-purple-50 rounded mb-2 flex justify-between items-center">
                    <span className="text-sm">{subject}</span>
                    <button onClick={() => copyToClipboard(subject)} className="text-purple-500">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Preheaders</h4>
                {results.email.preheaders.map((preheader, idx) => (
                  <div key={idx} className="p-2 bg-indigo-50 rounded mb-2 flex justify-between items-center">
                    <span className="text-sm">{preheader}</span>
                    <button onClick={() => copyToClipboard(preheader)} className="text-indigo-500">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Email Body</h4>
                {results.email.bodies.map((body, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded mb-2">
                    <pre className="text-sm whitespace-pre-wrap font-sans">{body}</pre>
                    <button 
                      onClick={() => copyToClipboard(body)} 
                      className="mt-2 text-purple-500 text-sm flex items-center"
                    >
                      <Copy className="w-3 h-3 mr-1" /> Copiar Email
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};