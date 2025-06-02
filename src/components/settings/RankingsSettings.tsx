import React, { useState } from 'react';
import { Trophy, Save, RotateCcw, Plus, Trash2, AlertCircle, CheckCircle, TrendingUp, Eye, Edit } from 'lucide-react';

interface RankingReward {
  position: number;
  rewardValue: number | string;
  rewardType: 'cash' | 'percentage' | 'chest' | 'points';
  chestType?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

interface RankingConfig {
  id: string;
  name: string;
  description: string;
  period: 'semanal' | 'mensal' | 'quinzenal' | 'trimestral' | 'anual';
  criteria: string[];
  weights: { [criterion: string]: number }; // Weight for each criterion
  tieBreaker: string;
  rewards: RankingReward[];
  isActive: boolean;
  startDate: string;
  endDate?: string;
  minParticipants: number;
  maxParticipants?: number;
  eligibilityCriteria: {
    minLevel: string;
    minIndicationsRequired: number;
    minActivityDays: number;
    excludeInactive: boolean;
  };
  notifications: {
    startNotification: boolean;
    endNotification: boolean;
    positionUpdates: boolean;
    finalResults: boolean;
  };
}

const initialRankingConfigs: RankingConfig[] = [
  {
    id: 'ranking1',
    name: 'Top Indicadores Semanal',
    description: 'Ranking semanal baseado no número de indicações diretas válidas',
    period: 'semanal',
    criteria: ['Número de indicações diretas válidas'],
    weights: { 'Número de indicações diretas válidas': 1.0 },
    tieBreaker: 'Data de cadastro mais antiga',
    rewards: [
      { position: 1, rewardValue: 500, rewardType: 'cash' },
      { position: 2, rewardValue: 300, rewardType: 'cash' },
      { position: 3, rewardValue: 150, rewardType: 'cash' },
    ],
    isActive: true,
    startDate: '2024-01-01',
    minParticipants: 5,
    eligibilityCriteria: {
      minLevel: 'Iniciante',
      minIndicationsRequired: 1,
      minActivityDays: 3,
      excludeInactive: true,
    },
    notifications: {
      startNotification: true,
      endNotification: true,
      positionUpdates: false,
      finalResults: true,
    },
  },
  {
    id: 'ranking2',
    name: 'Campeões da Rede Mensal',
    description: 'Ranking mensal baseado no GGR total da rede e jogadores ativos',
    period: 'mensal',
    criteria: ['GGR total da rede', 'Número de jogadores ativos na rede'],
    weights: { 'GGR total da rede': 0.7, 'Número de jogadores ativos na rede': 0.3 },
    tieBreaker: 'Maior GGR individual',
    rewards: [
      { position: 1, rewardValue: 'platinum', rewardType: 'chest', chestType: 'platinum' },
      { position: 2, rewardValue: 'gold', rewardType: 'chest', chestType: 'gold' },
      { position: 3, rewardValue: 'silver', rewardType: 'chest', chestType: 'silver' },
      { position: 4, rewardValue: 'bronze', rewardType: 'chest', chestType: 'bronze' },
      { position: 5, rewardValue: 'bronze', rewardType: 'chest', chestType: 'bronze' },
    ],
    isActive: true,
    startDate: '2024-01-01',
    minParticipants: 10,
    maxParticipants: 100,
    eligibilityCriteria: {
      minLevel: 'Profissional',
      minIndicationsRequired: 5,
      minActivityDays: 15,
      excludeInactive: true,
    },
    notifications: {
      startNotification: true,
      endNotification: true,
      positionUpdates: true,
      finalResults: true,
    },
  },
];

// Mock data for ranking visualization
const mockRankingData = [
  { position: 1, affiliateName: 'João Silva', affiliateId: 'AF001', score: 150, level: 'Expert', indicationsCount: 25, networkGGR: 15000, reward: 'R$ 500,00' },
  { position: 2, affiliateName: 'Maria Santos', affiliateId: 'AF002', score: 120, level: 'Profissional', indicationsCount: 20, networkGGR: 12000, reward: 'R$ 300,00' },
  { position: 3, affiliateName: 'Pedro Costa', affiliateId: 'AF003', score: 100, level: 'Profissional', indicationsCount: 18, networkGGR: 10000, reward: 'R$ 150,00' },
  { position: 4, affiliateName: 'Ana Oliveira', affiliateId: 'AF004', score: 95, level: 'Intermediário', indicationsCount: 16, networkGGR: 9500, reward: 'N/A' },
  { position: 5, affiliateName: 'Carlos Lima', affiliateId: 'AF005', score: 90, level: 'Intermediário', indicationsCount: 15, networkGGR: 9000, reward: 'N/A' },
];

const RankingsSettings: React.FC = () => {
  const [configs, setConfigs] = useState<RankingConfig[]>(initialRankingConfigs);
  const [selectedConfig, setSelectedConfig] = useState<RankingConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'edit' | 'preview' | 'analytics'>('list');
  const [hasChanges, setHasChanges] = useState(false);

  const availableCriteria = [
    'Número de indicações diretas válidas',
    'GGR total da rede',
    'Número de jogadores ativos na rede',
    'Maior sequência diária',
    'Volume de depósitos da rede',
    'Número de afiliados ativos na rede',
    'Taxa de conversão de indicações',
    'Tempo médio de atividade dos indicados',
  ];

  const availableLevels = ['Iniciante', 'Intermediário', 'Profissional', 'Expert', 'Master'];

  const createNewConfig = () => {
    const newConfig: RankingConfig = {
      id: `ranking${configs.length + 1}`,
      name: 'Novo Ranking',
      description: '',
      period: 'semanal',
      criteria: ['Número de indicações diretas válidas'],
      weights: { 'Número de indicações diretas válidas': 1.0 },
      tieBreaker: 'Data de cadastro mais antiga',
      rewards: [
        { position: 1, rewardValue: '', rewardType: 'cash' },
        { position: 2, rewardValue: '', rewardType: 'cash' },
        { position: 3, rewardValue: '', rewardType: 'cash' },
      ],
      isActive: false,
      startDate: new Date().toISOString().split('T')[0],
      minParticipants: 5,
      eligibilityCriteria: {
        minLevel: 'Iniciante',
        minIndicationsRequired: 1,
        minActivityDays: 3,
        excludeInactive: true,
      },
      notifications: {
        startNotification: true,
        endNotification: true,
        positionUpdates: false,
        finalResults: true,
      },
    };
    setSelectedConfig(newConfig);
    setActiveTab('edit');
    setHasChanges(true);
  };

  const editConfig = (config: RankingConfig) => {
    setSelectedConfig({ ...config });
    setActiveTab('edit');
  };

  const deleteConfig = (configId: string) => {
    if (confirm('Tem certeza que deseja excluir este ranking?')) {
      setConfigs(prev => prev.filter(c => c.id !== configId));
      if (selectedConfig?.id === configId) {
        setSelectedConfig(null);
        setActiveTab('list');
      }
    }
  };

  const saveConfig = () => {
    if (!selectedConfig) return;

    if (configs.find(c => c.id === selectedConfig.id)) {
      // Update existing
      setConfigs(prev => prev.map(c => c.id === selectedConfig.id ? selectedConfig : c));
    } else {
      // Add new
      setConfigs(prev => [...prev, selectedConfig]);
    }
    
    setHasChanges(false);
    setActiveTab('list');
    alert('Configuração do ranking salva com sucesso!');
  };

  const handleConfigChange = (field: keyof RankingConfig, value: any) => {
    if (!selectedConfig) return;
    setSelectedConfig(prev => prev ? { ...prev, [field]: value } : null);
    setHasChanges(true);
  };

  const handleCriteriaChange = (criterion: string, checked: boolean) => {
    if (!selectedConfig) return;
    
    let newCriteria = [...selectedConfig.criteria];
    let newWeights = { ...selectedConfig.weights };
    
    if (checked) {
      if (!newCriteria.includes(criterion)) {
        newCriteria.push(criterion);
        newWeights[criterion] = 1.0;
      }
    } else {
      newCriteria = newCriteria.filter(c => c !== criterion);
      delete newWeights[criterion];
    }
    
    setSelectedConfig(prev => prev ? { 
      ...prev, 
      criteria: newCriteria,
      weights: newWeights 
    } : null);
    setHasChanges(true);
  };

  const handleWeightChange = (criterion: string, weight: number) => {
    if (!selectedConfig) return;
    setSelectedConfig(prev => prev ? {
      ...prev,
      weights: { ...prev.weights, [criterion]: weight }
    } : null);
    setHasChanges(true);
  };

  const handleRewardChange = (index: number, field: keyof RankingReward, value: any) => {
    if (!selectedConfig) return;
    const newRewards = [...selectedConfig.rewards];
    (newRewards[index] as any)[field] = value;
    setSelectedConfig(prev => prev ? { ...prev, rewards: newRewards } : null);
    setHasChanges(true);
  };

  const addRewardPosition = () => {
    if (!selectedConfig) return;
    const newPosition = selectedConfig.rewards.length + 1;
    const newReward: RankingReward = {
      position: newPosition,
      rewardValue: '',
      rewardType: 'cash',
    };
    setSelectedConfig(prev => prev ? {
      ...prev,
      rewards: [...prev.rewards, newReward]
    } : null);
    setHasChanges(true);
  };

  const removeRewardPosition = (index: number) => {
    if (!selectedConfig || selectedConfig.rewards.length <= 1) return;
    const newRewards = selectedConfig.rewards.filter((_, i) => i !== index);
    // Reorder positions
    newRewards.forEach((reward, i) => {
      reward.position = i + 1;
    });
    setSelectedConfig(prev => prev ? { ...prev, rewards: newRewards } : null);
    setHasChanges(true);
  };

  const validateConfig = () => {
    if (!selectedConfig) return [];
    
    const errors = [];
    
    if (!selectedConfig.name.trim()) {
      errors.push('Nome do ranking é obrigatório');
    }
    
    if (selectedConfig.criteria.length === 0) {
      errors.push('Pelo menos um critério deve ser selecionado');
    }
    
    if (selectedConfig.rewards.some(r => r.rewardValue === '')) {
      errors.push('Todos os valores de recompensa devem ser preenchidos');
    }
    
    const totalWeight = Object.values(selectedConfig.weights).reduce((sum, w) => sum + w, 0);
    if (Math.abs(totalWeight - 1.0) > 0.01 && selectedConfig.criteria.length > 1) {
      errors.push('A soma dos pesos dos critérios deve ser igual a 1.0');
    }
    
    return errors;
  };

  const validationErrors = selectedConfig ? validateConfig() : [];

  const getRewardTypeLabel = (type: string) => {
    switch (type) {
      case 'cash': return 'Dinheiro (R$)';
      case 'percentage': return 'Porcentagem (%)';
      case 'chest': return 'Baú';
      case 'points': return 'Pontos';
      default: return 'Dinheiro (R$)';
    }
  };

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[400px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold text-branco mb-2 font-sora flex items-center">
            <Trophy size={24} className="mr-2 text-azul-ciano" />
            Configuração de Rankings
          </h2>
          <p className="text-sm text-gray-400">
            Configure rankings competitivos para motivar e recompensar afiliados
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          {activeTab === 'edit' && (
            <>
              <button 
                onClick={() => {
                  setSelectedConfig(null);
                  setActiveTab('list');
                  setHasChanges(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 flex items-center"
              >
                <RotateCcw size={16} className="mr-1" />
                Cancelar
              </button>
              <button 
                onClick={saveConfig}
                disabled={validationErrors.length > 0}
                className="px-4 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save size={16} className="mr-1" />
                Salvar Ranking
              </button>
            </>
          )}
          {activeTab === 'list' && (
            <button 
              onClick={createNewConfig}
              className="px-4 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Novo Ranking
            </button>
          )}
        </div>
      </div>

      {/* Status Indicators */}
      {activeTab === 'edit' && (
        <div className="flex flex-wrap gap-2 mb-6">
          {hasChanges && (
            <div className="flex items-center px-3 py-1 bg-yellow-600 text-yellow-100 rounded-full text-xs">
              <AlertCircle size={14} className="mr-1" />
              Alterações não salvas
            </div>
          )}
          {validationErrors.length === 0 && selectedConfig && (
            <div className="flex items-center px-3 py-1 bg-green-600 text-green-100 rounded-full text-xs">
              <CheckCircle size={14} className="mr-1" />
              Configuração válida
            </div>
          )}
          {validationErrors.length > 0 && (
            <div className="flex items-center px-3 py-1 bg-red-600 text-red-100 rounded-full text-xs">
              <AlertCircle size={14} className="mr-1" />
              {validationErrors.length} erro(s) encontrado(s)
            </div>
          )}
        </div>
      )}

      {/* Validation Errors */}
      {activeTab === 'edit' && validationErrors.length > 0 && (
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 mb-6">
          <h4 className="text-red-400 font-medium mb-2">Erros de Validação:</h4>
          <ul className="text-red-300 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-4 overflow-x-auto">
          {[
            { key: 'list', label: 'Lista de Rankings', icon: Trophy },
            ...(selectedConfig ? [
              { key: 'edit', label: 'Editar Ranking', icon: Edit },
              { key: 'preview', label: 'Visualizar', icon: Eye },
            ] : []),
            { key: 'analytics', label: 'Analytics', icon: TrendingUp },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center 
                ${activeTab === tab.key 
                  ? 'border-azul-ciano text-azul-ciano'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
            >
              <tab.icon size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-branco">Rankings Configurados</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {configs.map(config => (
              <div key={config.id} className="bg-cinza-escuro p-4 rounded-lg border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-medium text-branco flex items-center">
                      {config.name}
                      <span className={`ml-2 px-2 py-1 text-xs rounded ${
                        config.isActive ? 'bg-green-600 text-green-100' : 'bg-gray-600 text-gray-100'
                      }`}>
                        {config.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">{config.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editConfig(config)}
                      className="text-azul-ciano hover:text-opacity-80 p-1"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteConfig(config.id)}
                      className="text-red-500 hover:text-red-400 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Período:</span>
                    <span className="text-white capitalize">{config.period}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Critérios:</span>
                    <span className="text-white">{config.criteria.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Posições premiadas:</span>
                    <span className="text-white">Top {config.rewards.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min. participantes:</span>
                    <span className="text-white">{config.minParticipants}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {configs.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-400">
                <Trophy size={48} className="mx-auto mb-2 opacity-50" />
                <p>Nenhum ranking configurado ainda.</p>
                <button 
                  onClick={createNewConfig}
                  className="mt-2 text-azul-ciano hover:text-opacity-80"
                >
                  Criar primeiro ranking
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'edit' && selectedConfig && (
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nome do Ranking:</label>
                <input 
                  type="text" 
                  value={selectedConfig.name}
                  onChange={(e) => handleConfigChange('name', e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                  placeholder="Ex: Top Indicadores Semanal"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Período de Apuração:</label>
                <select 
                  value={selectedConfig.period}
                  onChange={(e) => handleConfigChange('period', e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                >
                  <option value="semanal">Semanal</option>
                  <option value="quinzenal">Quinzenal</option>
                  <option value="mensal">Mensal</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
              
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Descrição:</label>
                <textarea 
                  value={selectedConfig.description}
                  onChange={(e) => handleConfigChange('description', e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                  rows={2}
                  placeholder="Descrição do ranking e seus objetivos"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Data de Início:</label>
                <input 
                  type="date" 
                  value={selectedConfig.startDate}
                  onChange={(e) => handleConfigChange('startDate', e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedConfig.isActive}
                  onChange={(e) => handleConfigChange('isActive', e.target.checked)}
                  className="w-4 h-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano mr-2"
                />
                <label className="text-sm text-gray-300">Ranking ativo</label>
              </div>
            </div>
          </div>

          {/* Criteria and Weights */}
          <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Critérios de Classificação</h3>
            
            <div className="space-y-4">
              {availableCriteria.map(criterion => (
                <div key={criterion} className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={selectedConfig.criteria.includes(criterion)}
                      onChange={(e) => handleCriteriaChange(criterion, e.target.checked)}
                      className="mr-3 h-4 w-4 rounded bg-gray-700 border-gray-600 text-azul-ciano focus:ring-azul-ciano"
                    />
                    <span className="text-gray-300">{criterion}</span>
                  </div>
                  {selectedConfig.criteria.includes(criterion) && selectedConfig.criteria.length > 1 && (
                    <div className="flex items-center">
                      <span className="text-gray-400 text-sm mr-2">Peso:</span>
                      <input
                        type="number"
                        value={selectedConfig.weights[criterion] || 1.0}
                        onChange={(e) => handleWeightChange(criterion, Number(e.target.value))}
                        className="w-20 p-1 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                        min="0"
                        max="1"
                        step="0.1"
                      />
                    </div>
                  )}
                </div>
              ))}
              
              <div className="p-3 bg-blue-900/20 border border-blue-600 rounded">
                <label className="block text-sm font-medium text-blue-300 mb-1">Critério de Desempate:</label>
                <input 
                  type="text" 
                  value={selectedConfig.tieBreaker}
                  onChange={(e) => handleConfigChange('tieBreaker', e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                  placeholder="Ex: Data de cadastro mais antiga"
                />
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano">Recompensas por Posição</h3>
              <button 
                onClick={addRewardPosition}
                className="px-3 py-2 text-sm font-medium text-azul-ciano bg-transparent border border-azul-ciano rounded-md hover:bg-azul-ciano hover:text-white flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Adicionar Posição
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedConfig.rewards.map((reward, index) => (
                <div key={index} className="p-4 border border-gray-700 rounded-md bg-gray-800/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-branco">{reward.position}º Lugar</h4>
                    {selectedConfig.rewards.length > 1 && (
                      <button 
                        onClick={() => removeRewardPosition(index)} 
                        className="text-red-500 hover:text-red-400 p-1 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Recompensa:</label>
                      <select
                        value={reward.rewardType}
                        onChange={(e) => handleRewardChange(index, 'rewardType', e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                      >
                        <option value="cash">Dinheiro (R$)</option>
                        <option value="percentage">Porcentagem (%)</option>
                        <option value="chest">Baú</option>
                        <option value="points">Pontos</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Valor/Tipo:</label>
                      {reward.rewardType === 'chest' ? (
                        <select
                          value={reward.chestType || 'bronze'}
                          onChange={(e) => {
                            handleRewardChange(index, 'chestType', e.target.value);
                            handleRewardChange(index, 'rewardValue', e.target.value);
                          }}
                          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                        >
                          <option value="bronze">Baú de Bronze</option>
                          <option value="silver">Baú de Prata</option>
                          <option value="gold">Baú de Ouro</option>
                          <option value="platinum">Baú de Platina</option>
                          <option value="diamond">Baú de Diamante</option>
                        </select>
                      ) : (
                        <input
                          type="number"
                          value={reward.rewardValue}
                          onChange={(e) => handleRewardChange(index, 'rewardValue', Number(e.target.value))}
                          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                          placeholder="Ex: 500"
                          min="0"
                          step={reward.rewardType === 'percentage' ? '0.1' : '1'}
                        />
                      )}
                    </div>
                    
                    <div className="flex items-end">
                      <span className="text-sm text-gray-400">
                        {getRewardTypeLabel(reward.rewardType)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility and Participation */}
          <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Critérios de Elegibilidade</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nível Mínimo:</label>
                <select
                  value={selectedConfig.eligibilityCriteria.minLevel}
                  onChange={(e) => handleConfigChange('eligibilityCriteria', {
                    ...selectedConfig.eligibilityCriteria,
                    minLevel: e.target.value
                  })}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                >
                  {availableLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Min. Indicações:</label>
                <input
                  type="number"
                  value={selectedConfig.eligibilityCriteria.minIndicationsRequired}
                  onChange={(e) => handleConfigChange('eligibilityCriteria', {
                    ...selectedConfig.eligibilityCriteria,
                    minIndicationsRequired: Number(e.target.value)
                  })}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Min. Dias Ativos:</label>
                <input
                  type="number"
                  value={selectedConfig.eligibilityCriteria.minActivityDays}
                  onChange={(e) => handleConfigChange('eligibilityCriteria', {
                    ...selectedConfig.eligibilityCriteria,
                    minActivityDays: Number(e.target.value)
                  })}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                  min="0"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedConfig.eligibilityCriteria.excludeInactive}
                  onChange={(e) => handleConfigChange('eligibilityCriteria', {
                    ...selectedConfig.eligibilityCriteria,
                    excludeInactive: e.target.checked
                  })}
                  className="w-4 h-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano mr-2"
                />
                <label className="text-sm text-gray-300">Excluir inativos</label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Min. Participantes:</label>
                <input
                  type="number"
                  value={selectedConfig.minParticipants}
                  onChange={(e) => handleConfigChange('minParticipants', Number(e.target.value))}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Máx. Participantes (opcional):</label>
                <input
                  type="number"
                  value={selectedConfig.maxParticipants || ''}
                  onChange={(e) => handleConfigChange('maxParticipants', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                  min="1"
                  placeholder="Sem limite"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Configurações de Notificações</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(selectedConfig.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                  <div>
                    <label className="text-white font-medium">
                      {key === 'startNotification' ? 'Notificar Início' :
                       key === 'endNotification' ? 'Notificar Fim' :
                       key === 'positionUpdates' ? 'Atualizações de Posição' :
                       'Resultados Finais'}
                    </label>
                    <p className="text-sm text-gray-400">
                      {key === 'startNotification' ? 'Notificar quando o ranking iniciar' :
                       key === 'endNotification' ? 'Notificar quando o ranking terminar' :
                       key === 'positionUpdates' ? 'Notificar mudanças de posição' :
                       'Notificar resultados finais'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleConfigChange('notifications', {
                      ...selectedConfig.notifications,
                      [key]: e.target.checked
                    })}
                    className="w-4 h-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preview' && selectedConfig && (
        <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
          <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">
            Visualização: {selectedConfig.name}
          </h3>
          <p className="text-sm text-gray-400 mb-6">{selectedConfig.description}</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-branco">
              <thead className="bg-gray-700 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Posição</th>
                  <th className="px-4 py-3">Afiliado</th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nível</th>
                  <th className="px-4 py-3">Pontuação</th>
                  <th className="px-4 py-3">Indicações</th>
                  <th className="px-4 py-3">GGR da Rede</th>
                  <th className="px-4 py-3">Recompensa</th>
                </tr>
              </thead>
              <tbody>
                {mockRankingData.slice(0, Math.max(selectedConfig.rewards.length, 5)).map((row, _) => {
                  const reward = selectedConfig.rewards.find(r => r.position === row.position);
                  const rewardText = reward ? 
                    (reward.rewardType === 'cash' ? `R$ ${reward.rewardValue}` :
                     reward.rewardType === 'chest' ? `Baú de ${reward.chestType}` :
                     reward.rewardType === 'percentage' ? `${reward.rewardValue}%` :
                     `${reward.rewardValue} pontos`) : 'N/A';
                  
                  return (
                    <tr key={row.position} className={`border-b border-gray-700 ${
                      reward ? 'bg-yellow-900/20' : 'hover:bg-gray-700/50'
                    }`}>
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center">
                          {row.position <= 3 && (
                            <Trophy size={16} className={`mr-2 ${
                              row.position === 1 ? 'text-yellow-400' :
                              row.position === 2 ? 'text-gray-300' :
                              'text-orange-400'
                            }`} />
                          )}
                          {row.position}º
                        </div>
                      </td>
                      <td className="px-4 py-3">{row.affiliateName}</td>
                      <td className="px-4 py-3 font-mono text-gray-300">{row.affiliateId}</td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs">{row.level}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold">{row.score}</td>
                      <td className="px-4 py-3">{row.indicationsCount}</td>
                      <td className="px-4 py-3">R$ {row.networkGGR.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={reward ? 'text-green-400 font-semibold' : 'text-gray-400'}>
                          {rewardText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
          <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Analytics de Rankings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-azul-ciano mb-1">{configs.length}</div>
              <div className="text-sm text-gray-400">Rankings Configurados</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{configs.filter(c => c.isActive).length}</div>
              <div className="text-sm text-gray-400">Rankings Ativos</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">156</div>
              <div className="text-sm text-gray-400">Participantes Totais</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">R$ 12.500</div>
              <div className="text-sm text-gray-400">Recompensas Pagas</div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
            <h4 className="text-blue-400 font-medium mb-2">Métricas Disponíveis:</h4>
            <ul className="text-blue-300 text-sm space-y-1">
              <li>• Taxa de participação por ranking</li>
              <li>• Distribuição de posições por nível de afiliado</li>
              <li>• Efetividade dos critérios de classificação</li>
              <li>• ROI das recompensas oferecidas</li>
              <li>• Impacto dos rankings na retenção</li>
              <li>• Análise de engajamento competitivo</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingsSettings;

