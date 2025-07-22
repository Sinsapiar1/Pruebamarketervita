import type { ApiKeyCollection } from '../types';

export class AIProviderManager {
  private static getStoredKeys(): ApiKeyCollection {
    const stored = localStorage.getItem('marketinsight_api_keys');
    return stored ? JSON.parse(stored) : {};
  }

  static saveKeys(keys: ApiKeyCollection): void {
    localStorage.setItem('marketinsight_api_keys', JSON.stringify(keys));
  }

  static async testGeminiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user',  parts: [{ text: 'Test connection' }] }],
            generationConfig: { maxOutputTokens: 5 },
          }),
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  static async generateWithGemini(
    prompt: string,
    apiKey: string
  ): Promise<string> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user',  parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Error en Gemini API');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  static getAvailableProviders(): string[] {
    const keys = this.getStoredKeys();
    return Object.entries(keys)
      .filter(([_, keyData]) => keyData.status === 'valid')
      .map(([provider]) => provider);
  }

  static generateProductPrompt(
    nicho: string,
    publico: string,
    canal: string,
    presupuesto: string
  ): string {
    return `Actúa como MarketInsight Pro v3.0, experto en marketing de afiliados.

TAREA: Genera EXACTAMENTE 3 productos ganadores para el nicho "${nicho}" dirigido a "${publico}" usando "${canal}" con presupuesto de $${presupuesto}.

FORMATO REQUERIDO para cada producto:
=== PRODUCTO [N] ===
NOMBRE: [Nombre específico y real del producto]
DESCRIPCIÓN: [Descripción completa en 1-2 líneas]
PRECIO: [Precio realista en formato $XX]
COMISIÓN: [Comisión en $ y %]
SCORE: [Puntuación 1-10]
GRAVITY: [Número realista 50-200]
EPC: [Earnings per click en formato $X.XX]
CVR: [Conversion rate en formato X.X%]
PAIN_POINTS: [4 pain points separados por comas]
EMOCIONES: [4 emociones clave separadas por comas]
TRIGGERS: [4 triggers de conversión separados por comas]
=== FIN PRODUCTO [N] ===

REGLAS:
- NUNCA uses palabras como "potencial", "podría", "posible"
- Solo productos REALES y específicos
- Métricas REALISTAS basadas en el mercado
- Enfoque en CONVERSIÓN, no teoría`;
  }

  static generateCopyPrompt(
    producto: string,
    painPoints: string,
    triggers: string,
    plataforma: string
  ): string {
    return `Actúa como MarketInsight Pro v3.0, experto en copywriting de alta conversión.

PRODUCTO: ${producto}
PAIN POINTS: ${painPoints}
TRIGGERS: ${triggers}
PLATAFORMA: ${plataforma}

GENERA copy profesional para:

=== FACEBOOK ADS ===
HEADLINES:
[3 headlines diferentes, máximo 60 caracteres cada uno]

PRIMARY TEXT:
[2 textos primarios completos con emojis, estructura problema→solución→CTA]

CTAS:
[3 call-to-actions diferentes]

=== GOOGLE ADS ===
HEADLINES:
[3 headlines de 30 caracteres máximo]

DESCRIPTIONS:
[2 descriptions de 90 caracteres máximo]

=== EMAIL MARKETING ===
SUBJECTS:
[3 subjects con emojis, máximo 50 caracteres]

PREHEADERS:
[3 preheaders complementarios]

BODY:
[1 email completo estructura AIDA]

REGLAS:
- Usar pain points → beneficios
- Tono conversacional y urgente
- Incluir prueba social
- CTA claro y directo
- Optimizado para conversión`;
  }
}
