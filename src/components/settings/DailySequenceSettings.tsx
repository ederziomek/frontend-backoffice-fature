import React, { useState } from 'react';
import { Calendar, Gift, TrendingUp, Settings, Save, RotateCcw, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

interface DailySequenceMilestone {
  id: string;
  consecutiveDays: number | string;
  reward: number | string;
  rewardType: 'cash' | 'bonus' | 'multiplier';
  description: string;
}

interface DailySequenceSettingsData {
  milestones: DailySequenceMilestone[];
  paymentLogic: 'final' | 'cumulative';
  resetConditions: {
    missedDayResets: boolean;
    inactivityDays: number;
    manualReset: boolean;
  };
  bonusMultipliers: {
    enabled: boolean;
    weekendMultiplier: number;
    holidayMultiplier: number;
  };
  notifications: {
    reminderEnabled: boolean;
    reminderTime: string;
    achievementNotification: boolean;
    streakWarning: boolean;
  };
  analytics: {
    trackingEnabled: boolean;
    reportFrequency: 'daily' | 'weekly' | 'monthly';
  };
}

const initialSettings: DailySequenceSettingsData = {
  milestones: [
    { id: 'm1', consecutiveDays: 3, reward: 50, rewardType: 'cash', description: 'Bônus de início de sequência' },
    { id: 'm2', consecutiveDays: 7, reward: 150, rewardType: 'cash', description: 'Bônus semanal de consistência' },
    { id: 'm3', consecutiveDays: 15, reward: 400, rewardType: 'cash', description: 'Bônus quinzenal de dedicação' },
    { id: 'm4', consecutiveDays: 30, reward: 1000, rewardType: 'cash', description: 'Bônus mensal de excelência' },
  ],
  paymentLogic: 'cumulative',
  resetConditions: {
    missedDayResets: true,
    inactivityDays: 2,
    manualReset: false,
  },
  bonusMultipliers: {
    enabled: true,
    weekendMultiplier: 1.5,
    holidayMultiplier: 2.0,
  },
  notifications: {
    reminderEnabled: true,
    reminderTime: '09:00',
    achievementNotification: true,
    streakWarning: true,
  },
  analytics: {
    trackingEnabled: true,
    reportFrequency: 'weekly',
  },
};

const DailySequenceSettings: React.FC = () => {
  const [settings, setSettings] = useState<DailySequenceSettingsData>(initialSettings);
  const [activeTab, setActiveTab] = useState<'milestones' | 'rules' | 'notifications' | 'analytics'>('milestones');
  const [hasChanges, setHasChanges] = useState(false);

  const handleMilestoneChange = (index: number, field: keyof DailySequenceMilestone, value: string) => {
    const newMilestones = [...settings.milestones];
    if (field !== 'id') {
      (newMilestones[index] as any)[field] = field === 'consecutiveDays' || field === 'reward' ? 
        (value === '' ? '' : Number(value)) : value;
      setSettings(prev => ({ ...prev, milestones: newMilestones }));
      setHasChanges(true);
    }
  };

  const addMilestone = () => {
    const newMilestone: DailySequenceMilestone = {
      id: `m${settings.milestones.length + 1}`,
      consecutiveDays: '',
      reward: '',
      rewardType: 'cash',
      description: '',
    };
    setSettings(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone],
    }));
    setHasChanges(true);
  };

  const removeMilestone = (index: number) => {
    if (settings.milestones.length > 1) {
      const newMilestones = settings.milestones.filter((_, i) => i !== index);
      setSettings(prev => ({ ...prev, milestones: newMilestones }));
      setHasChanges(true);
    }
  };

  const handlePaymentLogicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({ ...prev, paymentLogic: e.target.value as 'final' | 'cumulative' }));
    setHasChanges(true);
  };

  const handleResetConditionChange = (field: keyof typeof settings.resetConditions, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      resetConditions: { ...prev.resetConditions, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleBonusMultiplierChange = (field: keyof typeof settings.bonusMultipliers, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      bonusMultipliers: { ...prev.bonusMultipliers, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleNotificationChange = (field: keyof typeof settings.notifications, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value }
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
    console.log('Saving Daily Sequence Settings:', settings);
    alert('Configurações da Sequência Diária salvas com sucesso!');
    setHasChanges(false);
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar todas as configurações para os valores padrão?')) {
      setSettings(initialSettings);
      setHasChanges(false);
    }
  };

  const getRewardTypeLabel = (type: string) => {
    switch (type) {
      case 'cash': return 'Dinheiro (R$)';
      case 'bonus': return 'Bônus (%)';
      case 'multiplier': return 'Multiplicador (x)';
      default: return 'Dinheiro (R$)';
    }
  };

  const validateMilestones = () => {
    const errors = [];
    const days = settings.milestones.map(m => Number(m.consecutiveDays)).filter(d => !isNaN(d));
    const hasDuplicates = days.length !== new Set(days).size;
    
    if (hasDuplicates) {
      errors.push('Existem marcos com o mesmo número de dias consecutivos');
    }
    
    const hasEmptyFields = settings.milestones.some(m => 
      m.consecutiveDays === '' || m.reward === '' || m.description.trim() === ''
    );
    
    if (hasEmptyFields) {
      errors.push('Todos os campos dos marcos devem ser preenchidos');
    }
    
    return errors;
  };

  const validationErrors = validateMilestones();

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[400px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold text-branco mb-2 font-sora flex items-center">
            <Calendar size={24} className="mr-2 text-azul-ciano" />
            Configurar Sequência Diária de Indicações
          </h2>
          <p className="text-sm text-gray-400">
            Configure marcos, recompensas e regras para o sistema de check-in diário
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
            { key: 'milestones', label: 'Marcos e Recompensas', icon: Gift },
            { key: 'rules', label: 'Regras e Condições', icon: Settings },
            { key: 'notifications', label: 'Notificações', icon: AlertCircle },
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
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano">Marcos de Sequência</h3>
              <button 
                onClick={addMilestone}
                className="px-3 py-2 text-sm font-medium text-azul-ciano bg-transparent border border-azul-ciano rounded-md hover:bg-azul-ciano hover:text-white flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Adicionar Marco
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Configure os marcos de dias consecutivos e suas respectivas recompensas. Os marcos devem estar em ordem crescente.
            </p>

            <div className="space-y-4">
              {settings.milestones.map((milestone, index) => (
                <div key={milestone.id} className="p-4 border border-gray-700 rounded-md bg-gray-800/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-branco">Marco {index + 1}</h4>
                    {settings.milestones.length > 1 && (
                      <button 
                        onClick={() => removeMilestone(index)} 
                        className="text-red-500 hover:text-red-400 p-1 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label htmlFor={`consecutiveDays-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                        Dias Consecutivos:
                      </label>
                      <input
                        type="number"
                        id={`consecutiveDays-${index}`}
                        value={milestone.consecutiveDays}
                        onChange={(e) => handleMilestoneChange(index, 'consecutiveDays', e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                        placeholder="Ex: 3"
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`rewardType-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                        Tipo de Recompensa:
                      </label>
                      <select
                        id={`rewardType-${index}`}
                        value={milestone.rewardType}
                        onChange={(e) => handleMilestoneChange(index, 'rewardType', e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                      >
                        <option value="cash">Dinheiro (R$)</option>
                        <option value="bonus">Bônus (%)</option>
                        <option value="multiplier">Multiplicador (x)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor={`reward-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                        Valor da Recompensa:
                      </label>
                      <input
                        type="number"
                        id={`reward-${index}`}
                        value={milestone.reward}
                        onChange={(e) => handleMilestoneChange(index, 'reward', e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                        placeholder="Ex: 50"
                        min="0"
                        step={milestone.rewardType === 'bonus' ? '0.1' : milestone.rewardType === 'multiplier' ? '0.1' : '1'}
                      />
                      <p className="text-xs text-gray-500 mt-1">{getRewardTypeLabel(milestone.rewardType)}</p>
                    </div>
                    
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                        Descrição:
                      </label>
                      <input
                        type="text"
                        id={`description-${index}`}
                        value={milestone.description}
                        onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                        placeholder="Descrição do marco"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">Lógica de Pagamento:</h4>
              <select 
                value={settings.paymentLogic}
                onChange={handlePaymentLogicChange}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
              >
                <option value="final">Recompensa apenas ao atingir o marco final da sequência</option>
                <option value="cumulative">Recompensa acumulativa a cada marco atingido</option>
              </select>
              <p className="text-xs text-blue-300 mt-2">
                {settings.paymentLogic === 'cumulative' 
                  ? 'O afiliado receberá a recompensa de cada marco conforme for atingindo.'
                  : 'O afiliado receberá apenas a recompensa do último marco atingido na sequência.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-6">
          {/* Reset Conditions */}
          <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Condições de Reset da Sequência</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                <div>
                  <label className="text-white font-medium">Reset por Dia Perdido</label>
                  <p className="text-sm text-gray-400">A sequência é resetada se o afiliado perder um dia</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.resetConditions.missedDayResets}
                  onChange={(e) => handleResetConditionChange('missedDayResets', e.target.checked)}
                  className="w-4 h-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano"
                />
              </div>
              
              <div className="p-3 bg-gray-800/50 rounded">
                <label className="text-white font-medium block mb-2">Dias de Inatividade para Reset</label>
                <p className="text-sm text-gray-400 mb-3">Número de dias sem indicações para resetar a sequência</p>
                <input
                  type="number"
                  value={settings.resetConditions.inactivityDays}
                  onChange={(e) => handleResetConditionChange('inactivityDays', Number(e.target.value))}
                  className="w-32 p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                  min="1"
                  max="30"
                />
                <span className="text-gray-400 ml-2">dias</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                <div>
                  <label className="text-white font-medium">Reset Manual Permitido</label>
                  <p className="text-sm text-gray-400">Administradores podem resetar sequências manualmente</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.resetConditions.manualReset}
                  onChange={(e) => handleResetConditionChange('manualReset', e.target.checked)}
                  className="w-4 h-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano"
                />
              </div>
            </div>
          </div>

          {/* Bonus Multipliers */}
          <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Multiplicadores de Bônus</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                <div>
                  <label className="text-white font-medium">Ativar Multiplicadores</label>
                  <p className="text-sm text-gray-400">Aplicar multiplicadores em dias especiais</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.bonusMultipliers.enabled}
                  onChange={(e) => handleBonusMultiplierChange('enabled', e.target.checked)}
                  className="w-4 h-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano"
                />
              </div>
              
              {settings.bonusMultipliers.enabled && (
                <>
                  <div className="p-3 bg-gray-800/50 rounded">
                    <label className="text-white font-medium block mb-2">Multiplicador de Final de Semana</label>
                    <p className="text-sm text-gray-400 mb-3">Multiplicador aplicado aos sábados e domingos</p>
                    <input
                      type="number"
                      value={settings.bonusMultipliers.weekendMultiplier}
                      onChange={(e) => handleBonusMultiplierChange('weekendMultiplier', Number(e.target.value))}
                      className="w-32 p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                      min="1"
                      max="5"
                      step="0.1"
                    />
                    <span className="text-gray-400 ml-2">x</span>
                  </div>
                  
                  <div className="p-3 bg-gray-800/50 rounded">
                    <label className="text-white font-medium block mb-2">Multiplicador de Feriados</label>
                    <p className="text-sm text-gray-400 mb-3">Multiplicador aplicado em feriados nacionais</p>
                    <input
                      type="number"
                      value={settings.bonusMultipliers.holidayMultiplier}
                      onChange={(e) => handleBonusMultiplierChange('holidayMultiplier', Number(e.target.value))}
                      className="w-32 p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                      min="1"
                      max="5"
                      step="0.1"
                    />
                    <span className="text-gray-400 ml-2">x</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-cinza-escuro p-4 md:p-6 rounded-lg shadow">
          <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Configurações de Notificações</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
              <div>
                <label className="text-white font-medium">Lembrete Diário</label>
                <p className="text-sm text-gray-400">Enviar lembrete para fazer indicação diária</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.reminderEnabled}
                onChange={(e) => handleNotificationChange('reminderEnabled', e.target.checked)}
                className="w-4 h-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano"
              />
            </div>
            
            {settings.notifications.reminderEnabled && (
              <div className="p-3 bg-gray-800/50 rounded">
                <label className="text-white font-medium block mb-2">Horário do Lembrete</label>
                <input
                  type="time"
                  value={settings.notifications.reminderTime}
                  onChange={(e) => handleNotificationChange('reminderTime', e.target.value)}
                  className="w-32 p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
              <div>
                <label className="text-white font-medium">Notificação de Conquista</label>
                <p className="text-sm text-gray-400">Notificar quando um marco for atingido</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.achievementNotification}
                onChange={(e) => handleNotificationChange('achievementNotification', e.target.checked)}
                className="w-4 h-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano"
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
              <div>
                <label className="text-white font-medium">Aviso de Sequência em Risco</label>
                <p className="text-sm text-gray-400">Avisar quando a sequência estiver em risco de ser perdida</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.streakWarning}
                onChange={(e) => handleNotificationChange('streakWarning', e.target.checked)}
                className="w-4 h-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano"
              />
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
                <p className="text-sm text-gray-400">Coletar dados de performance da sequência diária</p>
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
                <li>• Taxa de participação diária</li>
                <li>• Duração média das sequências</li>
                <li>• Marcos mais atingidos</li>
                <li>• Impacto dos multiplicadores</li>
                <li>• Efetividade das notificações</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySequenceSettings;

