import React, { useState } from 'react';

interface RewardChestRule {
  id: string;
  milestoneDescription: string; // e.g., "10 indicações diretas válidas" or "Rede atingir X jogadores ativos"
  rewardValue: number | string; // e.g., 100 or "Baú Premium"
}

interface RewardChestsSettingsData {
  directChests: RewardChestRule[];
  indirectChests: RewardChestRule[];
}

// User requested 1-2 examples for mock
const initialSettings: RewardChestsSettingsData = {
  directChests: [
    { id: 'dc1', milestoneDescription: 'Ao atingir 10 indicações diretas válidas', rewardValue: '' },
    { id: 'dc2', milestoneDescription: 'Ao atingir 25 indicações diretas válidas', rewardValue: '' },
  ],
  indirectChests: [
    { id: 'ic1', milestoneDescription: 'Quando a rede do afiliado atingir 50 jogadores ativos', rewardValue: '' },
  ],
};

const RewardChestsSettings: React.FC = () => {
  const [settings, setSettings] = useState<RewardChestsSettingsData>(initialSettings);

  const handleRuleChange = (
    chestType: 'directChests' | 'indirectChests',
    index: number,
    field: keyof RewardChestRule,
    value: string
  ) => {
    const newSettings = { ...settings };
    if (field !== 'id') { // Prevent changing ID
      (newSettings[chestType][index] as any)[field] = value;
      setSettings(newSettings);
    }
  };

  // Add/Remove for direct chests (example, can be adapted for indirect)
  // As per user feedback, for mock, fixed 1-2 rules. So, add/remove is commented out.
  /*
  const addRule = (chestType: 'directChests' | 'indirectChests') => {
    const newRuleId = `${chestType === 'directChests' ? 'dc' : 'ic'}${settings[chestType].length + 1}`;
    const newRule: RewardChestRule = {
      id: newRuleId,
      milestoneDescription: '',
      rewardValue: '',
    };
    setSettings(prev => ({
      ...prev,
      [chestType]: [...prev[chestType], newRule],
    }));
  };

  const removeRule = (chestType: 'directChests' | 'indirectChests', index: number) => {
    setSettings(prev => ({
      ...prev,
      [chestType]: prev[chestType].filter((_, i) => i !== index),
    }));
  };
  */

  const handleSave = () => {
    console.log('Saving Reward Chests Settings (mock):', settings);
    alert('Configurações de Baús de Recompensa salvas (mock)!');
  };

  const renderRuleInputs = (chestType: 'directChests' | 'indirectChests') => {
    return settings[chestType].map((rule, index) => (
      <div key={rule.id} className="p-3 border border-gray-700 rounded-md bg-gray-800/30 mb-3">
        <h4 className="text-md font-medium text-branco mb-2">Regra {index + 1}</h4>
        <div className="space-y-2 text-sm">
          <div>
            <label htmlFor={`${chestType}-milestone-${index}`} className="block font-medium text-gray-300 mb-1">
              Descrição do Marco/Regra:
            </label>
            <input
              type="text"
              id={`${chestType}-milestone-${index}`}
              value={rule.milestoneDescription}
              onChange={(e) => handleRuleChange(chestType, index, 'milestoneDescription', e.target.value)}
              className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              placeholder="Ex: Ao atingir X indicações"
            />
          </div>
          <div>
            <label htmlFor={`${chestType}-reward-${index}`} className="block font-medium text-gray-300 mb-1">
              Recompensa (Valor R$ ou Tipo de Baú):
            </label>
            <input
              type="text"
              id={`${chestType}-reward-${index}`}
              value={rule.rewardValue}
              onChange={(e) => handleRuleChange(chestType, index, 'rewardValue', e.target.value)}
              className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              placeholder="Ex: 100 ou Baú de Ouro"
            />
          </div>
        </div>
        {/* Remove button (commented out as per user feedback for mock)
        {settings[chestType].length > 1 && (
          <button 
            onClick={() => removeRule(chestType, index)} 
            className="text-red-500 hover:text-red-400 text-xs mt-2 p-1 rounded"
          >
            Remover Regra
          </button>
        )}
        */}
      </div>
    ));
  };

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[400px]">
      <h2 className="text-xl lg:text-2xl font-semibold text-branco mb-6 font-sora">Configuração de Baús de Recompensa</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Direct Reward Chests */}
        <div className="p-4 md:p-6 bg-cinza-escuro rounded-lg shadow">
          <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Baús por Indicações Diretas</h3>
          <p className="text-xs text-gray-400 mb-3">Configure 1-2 marcos de indicações diretas válidas e as recompensas associadas.</p>
          {renderRuleInputs('directChests')}
          {/* Add button (commented out as per user feedback for mock)
          <button 
            onClick={() => addRule('directChests')}
            className="mt-2 px-3 py-1.5 text-xs font-medium text-azul-ciano bg-cinza-escuro rounded-md hover:bg-gray-700 border border-azul-ciano"
          >
            Adicionar Regra de Baú Direto
          </button>
          */}
        </div>

        {/* Indirect Reward Chests */}
        <div className="p-4 md:p-6 bg-cinza-escuro rounded-lg shadow">
          <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Baús por Atividade da Rede</h3>
          <p className="text-xs text-gray-400 mb-3">Configure 1-2 regras baseadas na atividade da rede e as recompensas associadas.</p>
          {renderRuleInputs('indirectChests')}
          {/* Add button (commented out as per user feedback for mock)
          <button 
            onClick={() => addRule('indirectChests')}
            className="mt-2 px-3 py-1.5 text-xs font-medium text-azul-ciano bg-cinza-escuro rounded-md hover:bg-gray-700 border border-azul-ciano"
          >
            Adicionar Regra de Baú Indireto
          </button>
          */}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSave}
          className="px-6 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
        >
          Salvar Configurações de Baús
        </button>
      </div>
      {/* Histórico de Baús Concedidos - Omitido conforme feedback do usuário para o mockup */}
    </div>
  );
};

export default RewardChestsSettings;

