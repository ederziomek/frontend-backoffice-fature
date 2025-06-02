import React, { useState } from 'react';
import { Gift, Target, Users, Settings, Save, RotateCcw, Plus, Trash2, AlertCircle, CheckCircle, TrendingUp, Award } from 'lucide-react';

interface RewardChestRule {
  id: string;
  milestoneDescription: string;
  rewardValue: number | string;
  rewardType: 'cash' | 'percentage' | 'multiplier' | 'chest';
  chestType?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  isActive: boolean;
  validityPeriod?: number; // days
  maxClaims?: number; // max times this reward can be claimed
  cooldownPeriod?: number; // days between claims
}

interface RewardChestsSettingsData {
  directChests: RewardChestRule[];
  indirectChests: RewardChestRule[];
  globalSettings: {
    chestAnimationEnabled: boolean;
    autoClaimEnabled: boolean;
    notificationsEnabled: boolean;
    expirationWarningDays: number;
  };
  chestValues: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
    diamond: number;
  };
  analytics: {
    trackingEnabled: boolean;
    reportFrequency: 'daily' | 'weekly' | 'monthly';
  };
}

const initialSettings: RewardChestsSettingsData = {
  directChests: [
    { 
      id: 'dc1', 
      milestoneDescription: 'Ao atingir 10 indicações diretas válidas', 
      rewardValue: 100, 
      rewardType: 'cash',
      isActive: true,
      validityPeriod: 30,
      maxClaims: 1,
      cooldownPeriod: 0
    },
    { 
      id: 'dc2', 
      milestoneDescription: 'Ao atingir 25 indicações diretas válidas', 
      rewardValue: 'silver', 
      rewardType: 'chest',
      chestType: 'silver',
      isActive: true,
      validityPeriod: 30,
      maxClaims: 1,
      cooldownPeriod: 0
    },
    { 
      id: 'dc3', 
      milestoneDescription: 'Ao atingir 50 indicações diretas válidas', 
      rewardValue: 'gold', 
      rewardType: 'chest',
      chestType: 'gold',
      isActive: true,
      validityPeriod: 45,
      maxClaims: 1,
      cooldownPeriod: 0
    },
  ],
  indirectChests: [
    { 
      id: 'ic1', 
      milestoneDescription: 'Quando a rede do afiliado atingir 50 jogadores ativos', 
      rewardValue: 'bronze', 
      rewardType: 'chest',
      chestType: 'bronze',
      isActive: true,
      validityPeriod: 30,
      maxClaims: 1,
      cooldownPeriod: 0
    },
    { 
      id: 'ic2', 
      milestoneDescription: 'Quando a rede do afiliado atingir 100 jogadores ativos', 
      rewardValue: 500, 
      rewardType: 'cash',
      isActive: true,
      validityPeriod: 60,
      maxClaims: 1,
      cooldownPeriod: 30
    },
    { 
      id: 'ic3', 
      milestoneDescription: 'Quando a rede do afiliado gerar R$ 10.000 em depósitos mensais', 
      rewardValue: 'platinum', 
      rewardType: 'chest',
      chestType: 'platinum',
      isActive: true,
      validityPeriod: 30,
      maxClaims: 12,
      cooldownPeriod: 30
    },
  ],
  globalSettings: {
    chestAnimationEnabled: true,
    autoClaimEnabled: false,
    notificationsEnabled: true,
    expirationWarningDays: 7,
  },
  chestValues: {
    bronze: 50,
    silver: 150,
    gold: 400,
    platinum: 1000,
    diamond: 2500,
  },
  analytics: {
    trackingEnabled: true,
    reportFrequency: 'weekly',
  },
};

const RewardChestsSettings: React.FC = () => {
  const [settings, setSettings] = useState<RewardChestsSettingsData>(initialSettings);
  const [activeTab, setActiveTab] = useState<'direct' | 'indirect' | 'chests' | 'settings' | 'analytics'>('direct');
  const [hasChanges, setHasChanges] = useState(false);

  const handleRuleChange = (
    chestType: 'directChests' | 'indirectChests',
    index: number,
    field: keyof RewardChestRule,
    value: string | number | boolean
  ) => {
    const newSettings = { ...settings };
    if (field !== 'id') {
      (newSettings[chestType][index] as any)[field] = value;
      setSettings(newSettings);
      setHasChanges(true);
    }
  };

  const addRule = (chestType: 'directChests' | 'indirectChests') => {
    const newRuleId = `${chestType === 'directChests' ? 'dc' : 'ic'}${settings[chestType].length + 1}`;
    const newRule: RewardChestRule = {
      id: newRuleId,
      milestoneDescription: '',
      rewardValue: '',
      rewardType: 'cash',
      isActive: true,
      validityPeriod: 30,
      maxClaims: 1,
      cooldownPeriod: 0,
    };
    setSettings(prev => ({
      ...prev,
      [chestType]: [...prev[chestType], newRule],
    }));
    setHasChanges(true);
  };

  const removeRule = (chestType: 'directChests' | 'indirectChests', index: number) => {
    setSettings(prev => ({
      ...prev,
      [chestType]: prev[chestType].filter((_, i) => i !== index),
    }));
    setHasChanges(true);
  };

  const handleGlobalSettingChange = (field: keyof typeof settings.globalSettings, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      globalSettings: { ...prev.globalSettings, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleChestValueChange = (chestType: keyof typeof settings.chestValues, value: number) => {
    setSettings(prev => ({
      ...prev,
      chestValues: { ...prev.chestValues, [chestType]: value }
    }));
    setHasChanges(true);
  };

  const handleAnalyticsChange = (field: keyof typeof settings.analytics, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      analytics: { ...prev.analytics, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving Reward Chests Settings:', settings);
    alert('Configurações de Baús de Recompensa salvas com sucesso!');
    setHasChanges(false);
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar todas as configurações para os valores padrão?')) {
      setSettings(initialSettings);
      setHasChanges(false);
    }
  };

  const getChestColor = (chestType: string) => {
    switch (chestType) {
      case 'bronze': return 'text-orange-400';
      case 'silver': return 'text-gray-300';
      case 'gold': return 'text-yellow-400';
      case 'platinum': return 'text-blue-300';
      case 'diamond': return 'text-purple-300';
      default: return 'text-gray-400';
    }
  };

  const validateRules = () => {
    const errors = [];
    
    // Check direct chests
    const directErrors = settings.directChests.filter(rule => 
      !rule.milestoneDescription.trim() || 
      rule.rewardValue === '' ||
      (rule.rewardType === 'cash' && Number(rule.rewardValue) <= 0)
    );
    
    // Check indirect chests
    const indirectErrors = settings.indirectChests.filter(rule => 
      !rule.milestoneDescription.trim() || 
      rule.rewardValue === '' ||
      (rule.rewardType === 'cash' && Number(rule.rewardValue) <= 0)
    );
    
    if (directErrors.length > 0) {
      errors.push(`${directErrors.length} regra(s) de baús diretos com campos inválidos`);
    }
    
    if (indirectErrors.length > 0) {
      errors.push(`${indirectErrors.length} regra(s) de baús indiretos com campos inválidos`);
    }
    
    return errors;
  };

  const validationErrors = validateRules();

  const renderRuleInputs = (chestType: 'directChests' | 'indirectChests') => {
    return settings[chestType].map((rule, index) => (
      <div key={rule.id} className="p-4 border border-gray-700 rounded-md bg-gray-800/30 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <h4 className="text-md font-medium text-branco">Regra {index + 1}</h4>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rule.isActive}
                onChange={(e) => handleRuleChange(chestType, index, 'isActive', e.target.checked)}
                className="w-4 h-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano"
              />
              <span className="text-sm text-gray-400">Ativa</span>
            </div>
          </div>
          <button 
            onClick={() => removeRule(chestType, index)} 
            className="text-red-500 hover:text-red-400 p-1 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Descrição do Marco/Regra:
            </label>
            <input
              type="text"
              value={rule.milestoneDescription}
              onChange={(e) => handleRuleChange(chestType, index, 'milestoneDescription', e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
              placeholder="Ex: Ao atingir X indicações"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tipo de Recompensa:
            </label>
            <select
              value={rule.rewardType}
              onChange={(e) => handleRuleChange(chestType, index, 'rewardType', e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
            >
              <option value="cash">Dinheiro (R$)</option>
              <option value="percentage">Porcentagem (%)</option>
              <option value="multiplier">Multiplicador (x)</option>
              <option value="chest">Baú</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Valor/Tipo:
            </label>
            {rule.rewardType === 'chest' ? (
              <select
                value={rule.chestType || 'bronze'}
                onChange={(e) => {
                  handleRuleChange(chestType, index, 'chestType', e.target.value);
                  handleRuleChange(chestType, index, 'rewardValue', e.target.value);
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
                value={rule.rewardValue}
                onChange={(e) => handleRuleChange(chestType, index, 'rewardValue', Number(e.target.value))}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                placeholder="Ex: 100"
                min="0"
                step={rule.rewardType === 'percentage' || rule.rewardType === 'multiplier' ? '0.1' : '1'}
              />
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Validade (dias):
            </label>
            <input
              type="number"
              value={rule.validityPeriod || 30}
              onChange={(e) => handleRuleChange(chestType, index, 'validityPeriod', Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
              min="1"
              max="365"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Máx. Resgates:
            </label>
            <input
              type="number"
              value={rule.maxClaims || 1}
              onChange={(e) => handleRuleChange(chestType, index, 'maxClaims', Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
              min="1"
              max="999"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Cooldown (dias):
            </label>
            <input
              type="number"
              value={rule.cooldownPeriod || 0}
              onChange={(e) => handleRuleChange(chestType, index, 'cooldownPeriod', Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
              min="0"
              max="365"
            />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[400px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold text-branco mb-2 font-sora flex items-center">
            <Gift size={24} className="mr-2 text-azul-ciano" />
            Configuração de Baús de Recompensa
          </h2>
          <p className="text-sm text-gray-400">
            Configure marcos, tipos de baús e regras para o sistema de recompensas
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button 
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 flex items-center"
          >
            <RotateCcw size={16} className="mr-1" />
            Resetar
          </button>
          <button 
            onClick={handleSave}
            disabled={validationErrors.length > 0}
            className="px-4 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Save size={16} className="mr-1" />
            Salvar Configurações
          </button>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex flex-wrap gap-2 mb-6">
        {hasChanges && (
          <div className="flex items-center px-3 py-1 bg-yellow-600 text-yellow-100 rounded-full text-xs">
            <AlertCircle size={14} className="mr-1" />
            Alterações não salvas
          </div>
        )}
        {validationErrors.length === 0 && (
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

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
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
            { key: 'direct', label: 'Baús Diretos', icon: Target },
            { key: 'indirect', label: 'Baús da Rede', icon: Users },
            { key: 'chests', label: 'Tipos de Baús', icon: Award },
            { key: 'settings', label: 'Configurações', icon: Settings },
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
      {activeTab === 'direct' && (
        <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano">Baús por Indicações Diretas</h3>
            <button 
              onClick={() => addRule('directChests')}
              className="px-3 py-2 text-sm font-medium text-azul-ciano bg-transparent border border-azul-ciano rounded-md hover:bg-azul-ciano hover:text-white flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Adicionar Regra
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Configure marcos baseados no número de indicações diretas válidas e as recompensas associadas.
          </p>
          {renderRuleInputs('directChests')}
        </div>
      )}

      {activeTab === 'indirect' && (
        <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano">Baús por Atividade da Rede</h3>
            <button 
              onClick={() => addRule('indirectChests')}
              className="px-3 py-2 text-sm font-medium text-azul-ciano bg-transparent border border-azul-ciano rounded-md hover:bg-azul-ciano hover:text-white flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Adicionar Regra
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Configure marcos baseados na atividade da rede (jogadores ativos, volume de depósitos, etc.) e as recompensas associadas.
          </p>
          {renderRuleInputs('indirectChests')}
        </div>
      )}

      {activeTab === 'chests' && (
        <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
          <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Valores dos Tipos de Baús</h3>
          <p className="text-xs text-gray-400 mb-6">
            Configure o valor em dinheiro de cada tipo de baú. Estes valores serão usados quando o tipo de recompensa for "Baú".
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(settings.chestValues).map(([chestType, value]) => (
              <div key={chestType} className="p-4 bg-gray-800/50 rounded-lg text-center">
                <div className={`text-2xl mb-2 ${getChestColor(chestType)}`}>
                  <Gift size={32} className="mx-auto" />
                </div>
                <h4 className={`font-medium mb-2 capitalize ${getChestColor(chestType)}`}>
                  Baú de {chestType === 'bronze' ? 'Bronze' : 
                           chestType === 'silver' ? 'Prata' : 
                           chestType === 'gold' ? 'Ouro' : 
                           chestType === 'platinum' ? 'Platina' : 'Diamante'}
                </h4>
                <div className="flex items-center">
                  <span className="text-gray-400 text-sm mr-2">R$</span>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleChestValueChange(chestType as keyof typeof settings.chestValues, Number(e.target.value))}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm text-center"
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
            <h4 className="text-blue-400 font-medium mb-2">Hierarquia de Baús:</h4>
            <p className="text-blue-300 text-sm">
              Bronze &lt; Prata &lt; Ouro &lt; Platina &lt; Diamante
            </p>
            <p className="text-blue-300 text-xs mt-2">
              Use baús de maior valor para marcos mais difíceis de atingir.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Configurações Globais</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                <div>
                  <label className="text-white font-medium">Animação de Baús</label>
                  <p className="text-sm text-gray-400">Exibir animação ao abrir baús</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.globalSettings.chestAnimationEnabled}
                  onChange={(e) => handleGlobalSettingChange('chestAnimationEnabled', e.target.checked)}
                  className="w-4 h-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                <div>
                  <label className="text-white font-medium">Resgate Automático</label>
                  <p className="text-sm text-gray-400">Resgatar baús automaticamente quando disponíveis</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.globalSettings.autoClaimEnabled}
                  onChange={(e) => handleGlobalSettingChange('autoClaimEnabled', e.target.checked)}
                  className="w-4 h-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                <div>
                  <label className="text-white font-medium">Notificações</label>
                  <p className="text-sm text-gray-400">Notificar quando baús estiverem disponíveis</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.globalSettings.notificationsEnabled}
                  onChange={(e) => handleGlobalSettingChange('notificationsEnabled', e.target.checked)}
                  className="w-4 h-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano"
                />
              </div>
              
              <div className="p-3 bg-gray-800/50 rounded">
                <label className="text-white font-medium block mb-2">Aviso de Expiração</label>
                <p className="text-sm text-gray-400 mb-3">Avisar quantos dias antes do baú expirar</p>
                <input
                  type="number"
                  value={settings.globalSettings.expirationWarningDays}
                  onChange={(e) => handleGlobalSettingChange('expirationWarningDays', Number(e.target.value))}
                  className="w-32 p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                  min="1"
                  max="30"
                />
                <span className="text-gray-400 ml-2">dias</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
          <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Configurações de Analytics</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
              <div>
                <label className="text-white font-medium">Rastreamento Ativado</label>
                <p className="text-sm text-gray-400">Coletar dados de performance dos baús de recompensa</p>
              </div>
              <input
                type="checkbox"
                checked={settings.analytics.trackingEnabled}
                onChange={(e) => handleAnalyticsChange('trackingEnabled', e.target.checked)}
                className="w-4 h-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano"
              />
            </div>
            
            {settings.analytics.trackingEnabled && (
              <div className="p-3 bg-gray-800/50 rounded">
                <label className="text-white font-medium block mb-2">Frequência de Relatórios</label>
                <p className="text-sm text-gray-400 mb-3">Com que frequência gerar relatórios automáticos</p>
                <select
                  value={settings.analytics.reportFrequency}
                  onChange={(e) => handleAnalyticsChange('reportFrequency', e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                >
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
            )}
            
            <div className="p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">Métricas Coletadas:</h4>
              <ul className="text-blue-300 text-sm space-y-1">
                <li>• Taxa de resgate de baús por tipo</li>
                <li>• Tempo médio para atingir marcos</li>
                <li>• Baús mais populares</li>
                <li>• Taxa de expiração de baús</li>
                <li>• Impacto dos baús na retenção</li>
                <li>• ROI por tipo de recompensa</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardChestsSettings;

