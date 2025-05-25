import React, { useState } from 'react';

interface InactivityRule {
  // For simplicity, we'll use a single rule as per user feedback for mock
  inactivityPeriodDays: number | string; // e.g., 30 days without new valid referrals
  commissionReductionPercentage: number | string; // e.g., 10% reduction
  reactivationGoal: number | string; // e.g., 2 new valid referrals to reactivate
}

const initialSettings: InactivityRule = {
  inactivityPeriodDays: '',
  commissionReductionPercentage: '',
  reactivationGoal: '',
};

const InactivityRulesSettings: React.FC = () => {
  const [settings, setSettings] = useState<InactivityRule>(initialSettings);

  const handleChange = (field: keyof InactivityRule, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving Inactivity Rules (mock):', settings);
    alert('Regras de Inatividade de Afiliados salvas (mock)!');
  };

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[400px]">
      <h2 className="text-xl lg:text-2xl font-semibold text-branco mb-6 font-sora">Configurar Regras de Inatividade de Afiliados</h2>
      
      <div className="p-4 md:p-6 bg-cinza-escuro rounded-lg shadow">
        <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Definição de Regra de Inatividade (Simplificada)</h3>
        <p className="text-xs text-gray-400 mb-4">Configure uma regra simplificada para inatividade de afiliados e a meta para reativação.</p>

        <div className="space-y-4 text-sm">
          <div>
            <label htmlFor="inactivityPeriodDays" className="block font-medium text-gray-300 mb-1">
              Período para Considerar Inatividade (dias sem novas indicações válidas):
            </label>
            <input 
              type="number" 
              id="inactivityPeriodDays" 
              value={settings.inactivityPeriodDays}
              onChange={(e) => handleChange('inactivityPeriodDays', e.target.value)}
              className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              placeholder="Ex: 30"
            />
          </div>
          
          <div>
            <label htmlFor="commissionReductionPercentage" className="block font-medium text-gray-300 mb-1">
              Redução de Comissão RevShare (%) após período inativo (Exemplo Simplificado):
            </label>
            <input 
              type="number" 
              id="commissionReductionPercentage" 
              value={settings.commissionReductionPercentage}
              onChange={(e) => handleChange('commissionReductionPercentage', e.target.value)}
              className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              placeholder="Ex: 10 para 10%"
            />
            <p className="text-xs text-gray-500 mt-1">Nota: A documentação original sugere um sistema progressivo. Para o mockup, usamos uma redução única.</p>
          </div>

          <div>
            <label htmlFor="reactivationGoal" className="block font-medium text-gray-300 mb-1">
              Meta de Reativação (novas indicações válidas para normalizar comissões):
            </label>
            <input 
              type="number" 
              id="reactivationGoal" 
              value={settings.reactivationGoal}
              onChange={(e) => handleChange('reactivationGoal', e.target.value)}
              className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              placeholder="Ex: 2"
            />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSave}
            className="px-6 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
          >
            Salvar Regras de Inatividade
          </button>
        </div>
      </div>
    </div>
  );
};

export default InactivityRulesSettings;

