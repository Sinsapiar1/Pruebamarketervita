export interface ApiKey {
  key: string;
  status: 'not_configured' | 'valid' | 'invalid' | 'testing';
  provider: string;
}

export interface ApiKeyCollection {
  [providerId: string]: ApiKey;
}

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  comision: string;
  score: number;
  gravity: number;
  epc: string;
  cvr: string;
  pain_points: string[];
  emociones: string[];
  triggers: string[];
}

export interface CopyResult {
  facebook: {
    headlines: string[];
    primaryTexts: string[];
    ctas: string[];
  };
  google: {
    headlines: string[];
    descriptions: string[];
  };
  email: {
    subjects: string[];
    preheaders: string[];
    bodies: string[];
  };
}
