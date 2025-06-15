// API Service para integração com os novos microserviços
import axios from 'axios';

// URLs base dos serviços
const CONFIG_SERVICE_URL = 'http://localhost:5000';
const INTEGRATION_SERVICE_URL = 'http://localhost:3000';
const GAMIFICATION_SERVICE_URL = 'http://localhost:3001';

// Configuração do axios
const configApi = axios.create({
  baseURL: CONFIG_SERVICE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const integrationApi = axios.create({
  baseURL: INTEGRATION_SERVICE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const gamificationApi = axios.create({
  baseURL: GAMIFICATION_SERVICE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces TypeScript
export interface Configuration {
  id?: number;
  key: string;
  value: any;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceStatus {
  status: 'healthy' | 'unhealthy' | 'unknown';
  error?: any;
  responseTime?: number;
  lastCheck?: Date;
}

export interface CPAValidationRequest {
  user_id: string;
  deposit_amount: number;
  bet_count: number;
  ggr_amount: number;
  registration_date: string;
}

export interface CPAValidationResponse {
  valid: boolean;
  reason?: string;
  fraud_detected?: boolean;
  model_used?: string;
}

export interface BehaviorAnalysisRequest {
  user_id: string;
  deposits: Array<{
    amount: number;
    date: string;
  }>;
  bets: Array<{
    amount: number;
    date: string;
  }>;
  sessions: Array<{
    duration: number;
    date: string;
  }>;
}

export interface BehaviorAnalysisResponse {
  user_id: string;
  behavioral_score: number;
  risk_classification: 'low' | 'medium' | 'high' | 'very_high';
  analysis: {
    deposit_pattern: string;
    betting_pattern: string;
    session_pattern: string;
  };
}

export interface ChestOptimizationRequest {
  user_id: string;
  behavioral_score: number;
  risk_classification: string;
  available_chests: string[];
}

export interface ChestOptimizationResponse {
  user_id: string;
  recommended_chests: Array<{
    type: string;
    probability: number;
    expected_value: number;
  }>;
  optimization_reason: string;
}

// Config Service API
export const configService = {
  // Health check
  async healthCheck() {
    try {
      const response = await configApi.get('/api/health');
      return response.data;
    } catch (error) {
      console.error('Config Service health check failed:', error);
      throw error;
    }
  },

  // Listar todas as configurações
  async getAllConfigurations(): Promise<Configuration[]> {
    try {
      const response = await configApi.get('/api/v1/configurations');
      return response.data;
    } catch (error) {
      console.error('Error fetching configurations:', error);
      throw error;
    }
  },

  // Buscar configuração específica
  async getConfiguration(key: string): Promise<Configuration> {
    try {
      const response = await configApi.get(`/api/v1/configurations/${key}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching configuration ${key}:`, error);
      throw error;
    }
  },

  // Atualizar configuração
  async updateConfiguration(key: string, value: any): Promise<Configuration> {
    try {
      const response = await configApi.put(`/api/v1/configurations/${key}`, { value });
      return response.data;
    } catch (error) {
      console.error(`Error updating configuration ${key}:`, error);
      throw error;
    }
  },

  // Criar nova configuração
  async createConfiguration(config: Omit<Configuration, 'id' | 'created_at' | 'updated_at'>): Promise<Configuration> {
    try {
      const response = await configApi.post('/api/v1/configurations', config);
      return response.data;
    } catch (error) {
      console.error('Error creating configuration:', error);
      throw error;
    }
  },

  // Remover configuração
  async deleteConfiguration(key: string): Promise<void> {
    try {
      await configApi.delete(`/api/v1/configurations/${key}`);
    } catch (error) {
      console.error(`Error deleting configuration ${key}:`, error);
      throw error;
    }
  },

  // Estatísticas de propagação
  async getPropagationStats() {
    try {
      const response = await configApi.get('/api/v1/propagation/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching propagation stats:', error);
      throw error;
    }
  },
};

// Integration Service API (CPA)
export const integrationService = {
  // Health check
  async healthCheck() {
    try {
      const response = await integrationApi.get('/health');
      return response.data;
    } catch (error) {
      console.error('Integration Service health check failed:', error);
      throw error;
    }
  },

  // Validar CPA
  async validateCPA(request: CPAValidationRequest): Promise<CPAValidationResponse> {
    try {
      const response = await integrationApi.post('/api/v1/integration-service/validate-cpa', request);
      return response.data;
    } catch (error) {
      console.error('Error validating CPA:', error);
      throw error;
    }
  },

  // Consultar regras CPA
  async getCPARules() {
    try {
      const response = await integrationApi.get('/api/v1/integration-service/cpa-rules');
      return response.data;
    } catch (error) {
      console.error('Error fetching CPA rules:', error);
      throw error;
    }
  },

  // Executar testes CPA
  async testCPA() {
    try {
      const response = await integrationApi.post('/api/v1/integration-service/test-cpa');
      return response.data;
    } catch (error) {
      console.error('Error running CPA tests:', error);
      throw error;
    }
  },
};

// Gamification Service API
export const gamificationService = {
  // Health check
  async healthCheck() {
    try {
      const response = await gamificationApi.get('/health');
      return response.data;
    } catch (error) {
      console.error('Gamification Service health check failed:', error);
      throw error;
    }
  },

  // Análise comportamental
  async analyzeBehavior(request: BehaviorAnalysisRequest): Promise<BehaviorAnalysisResponse> {
    try {
      const response = await gamificationApi.post('/api/v1/gamification-service/analyze-behavior', request);
      return response.data;
    } catch (error) {
      console.error('Error analyzing behavior:', error);
      throw error;
    }
  },

  // Otimização de baús
  async optimizeChests(request: ChestOptimizationRequest): Promise<ChestOptimizationResponse> {
    try {
      const response = await gamificationApi.post('/api/v1/gamification-service/optimize-chests', request);
      return response.data;
    } catch (error) {
      console.error('Error optimizing chests:', error);
      throw error;
    }
  },

  // Calcular recompensas
  async calculateRewards(request: any) {
    try {
      const response = await gamificationApi.post('/api/v1/gamification-service/calculate-rewards', request);
      return response.data;
    } catch (error) {
      console.error('Error calculating rewards:', error);
      throw error;
    }
  },

  // Executar suite de testes
  async runTestSuite() {
    try {
      const response = await gamificationApi.post('/api/v1/gamification-service/test-suite');
      return response.data;
    } catch (error) {
      console.error('Error running gamification test suite:', error);
      throw error;
    }
  },
};

// Função utilitária para verificar status de todos os serviços
export const checkAllServicesHealth = async () => {
  const results: {
    configService: ServiceStatus;
    integrationService: ServiceStatus;
    gamificationService: ServiceStatus;
  } = {
    configService: { status: 'unknown', error: null },
    integrationService: { status: 'unknown', error: null },
    gamificationService: { status: 'unknown', error: null },
  };

  try {
    await configService.healthCheck();
    results.configService.status = 'healthy';
  } catch (error) {
    results.configService.status = 'unhealthy';
    results.configService.error = error;
  }

  try {
    await integrationService.healthCheck();
    results.integrationService.status = 'healthy';
  } catch (error) {
    results.integrationService.status = 'unhealthy';
    results.integrationService.error = error;
  }

  try {
    await gamificationService.healthCheck();
    results.gamificationService.status = 'healthy';
  } catch (error) {
    results.gamificationService.status = 'unhealthy';
    results.gamificationService.error = error;
  }

  return results;
};

export default {
  configService,
  integrationService,
  gamificationService,
  checkAllServicesHealth,
};

