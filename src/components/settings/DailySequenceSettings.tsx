import React, { useState } from 'react';

interface DailySequenceMilestone {
  id: string;
  consecutiveDays: number | string;
  reward: number | string;
}

interface DailySequenceSettingsData {
  milestones: DailySequenceMilestone[];
  paymentLogic: 'final' | 'cumulative'; // Recompensa apenas ao atingir o marco final ou acumulativa
}

const initialSettings: DailySequenceSettingsData = {
  milestones: [
    { id: 'm1', consecutiveDays: 3, reward: '' },
    { id: 'm2', consecutiveDays: 5, reward: '' },
    { id: 'm3', consecutiveDays: 7, reward: '' },
  ],
  paymentLogic: 'final',
};

const DailySequenceSettings: React.FC = () => {
  const [settings, setSettings] = useState<DailySequenceSettingsData>(initialSettings);

  const handleMilestoneChange = (index: number, field: keyof DailySequenceMilestone, value: string) => {
    const newMilestones = [...settings.milestones];
    // Ensure that 'id' is not changed through this handler
    if (field !== 'id') {
      (newMilestones[index] as any)[field] = value;
      setSettings(prev => ({ ...prev, milestones: newMilestones }));
    }
  };

  const handlePaymentLogicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({ ...prev, paymentLogic: e.target.value as 'final' | 'cumulative' }));
  };

  // According to user feedback, no dynamic add/remove for milestones in mock
  // const addMilestone = () => {
  //   setSettings(prev => ({
  //     ...prev,
  //     milestones: [...prev.milestones, { id: `m${prev.milestones.length + 1}`, consecutiveDays: '', reward: '' }],
  //   }));
  // };

  // const removeMilestone = (index: number) => {
  //   const newMilestones = settings.milestones.filter((_, i) => i !== index);
  //   setSettings(prev => ({ ...prev, milestones: newMilestones }));
  // };

  const handleSave = () => {
    console.log('Saving Daily Sequence Settings (mock):', settings);
    alert('Configurações da Sequência Diária salvas (mock)!');
  };

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[400px]">
      <h2 className="text-xl lg:text-2xl font-semibold text-branco mb-6 font-sora">Configurar Bônus de Sequência Diária (Check-in)</h2>
      
      <div className="p-4 md:p-6 bg-cinza-escuro rounded-lg shadow">
        <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Definição de Marcos e Recompensas</h3>
        <p className="text-xs text-gray-400 mb-4">Configure 2-3 marcos fixos para a sequência diária de indicações válidas.</p>

        <div className="space-y-4 mb-6">
          {settings.milestones.map((milestone, index) => (
            <div key={milestone.id} className="p-3 border border-gray-700 rounded-md bg-gray-800/30">
              <h4 className="text-md font-medium text-branco mb-2">Marco {index + 1}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`consecutiveDays-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                    Dias Consecutivos de Indicações Válidas:
                  </label>
                  <input
                    type="number"
                    id={`consecutiveDays-${index}`}
                    value={milestone.consecutiveDays}
                    onChange={(e) => handleMilestoneChange(index, 'consecutiveDays', e.target.value)}
                    className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                    placeholder="Ex: 3"
                  />
                </div>
                <div>
                  <label htmlFor={`reward-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                    Recompensa (R$):
                  </label>
                  <input
                    type="number"
                    id={`reward-${index}`}
                    value={milestone.reward}
                    onChange={(e) => handleMilestoneChange(index, 'reward', e.target.value)}
                    className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                    placeholder="Ex: 50"
                  />
                </div>
              </div>
              {/* According to user, no dynamic add/remove for mock
              {settings.milestones.length > 1 && (
                <button 
                  onClick={() => removeMilestone(index)} 
                  className="text-red-500 hover:text-red-400 text-xs mt-2 p-1 rounded"
                >
                  Remover Marco
                </button>
              )} 
              */}
            </div>
          ))}
          {/* According to user, no dynamic add for mock
          <button 
            onClick={addMilestone}
            className="mt-2 px-3 py-1.5 text-xs font-medium text-azul-ciano bg-cinza-escuro rounded-md hover:bg-gray-700 border border-azul-ciano"
          >
            Adicionar Novo Marco
          </button> 
          */}
        </div>

        <div className="mb-6">
          <label htmlFor="paymentLogic" className="block text-sm font-medium text-gray-300 mb-1">
            Lógica de Pagamento da Recompensa:
          </label>
          <select 
            id="paymentLogic" 
            value={settings.paymentLogic}
            onChange={handlePaymentLogicChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
          >
            <option value="final">Recompensa apenas ao atingir o marco final da sequência</option>
            <option value="cumulative">Recompensa acumulativa a cada marco atingido</option>
          </select>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSave}
            className="px-6 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
          >
            Salvar Configurações da Sequência
          </button>
        </div>
      </div>
      {/* Histórico de Bônus de Sequência Pagos - Omitido conforme feedback do usuário para o mockup */}
    </div>
  );
};

export default DailySequenceSettings;

