import React, { useState } from 'react';

interface CommissionSafeSettingsData {
  revSharePercentageToSafe: number | string; // e.g., 10 for 10%
  weeklyDistributionPercentage: number | string; // e.g., 50 for 50% of accumulated safe balance
  monthlyDistributionPercentage: number | string; // e.g., 100 for 100% of remaining accumulated safe balance
}

const initialSettings: CommissionSafeSettingsData = {
  revSharePercentageToSafe: '',
  weeklyDistributionPercentage: '',
  monthlyDistributionPercentage: '',
};

const CommissionSafeSettings: React.FC = () => {
  const [settings, setSettings] = useState<CommissionSafeSettingsData>(initialSettings);

  const handleChange = (field: keyof CommissionSafeSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving Commission Safe Settings (mock):', settings);
    alert('Configurações do Cofre de Comissões salvas (mock)!');
  };

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[400px]">
      <h2 className="text-xl lg:text-2xl font-semibold text-branco mb-6 font-sora">Configurar Cofre de Comissões</h2>
      
      <div className="p-4 md:p-6 bg-cinza-escuro rounded-lg shadow">
        <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Definições do Cofre</h3>
        <p className="text-xs text-gray-400 mb-4">
          Configure o percentual do Revenue Share destinado ao cofre e como o saldo acumulado será distribuído.
        </p>

        <div className="space-y-4 text-sm">
          <div>
            <label htmlFor="revSharePercentageToSafe" className="block font-medium text-gray-300 mb-1">
              Percentual do Revenue Share para o Cofre (%):
            </label>
            <input 
              type="number" 
              id="revSharePercentageToSafe" 
              value={settings.revSharePercentageToSafe}
              onChange={(e) => handleChange('revSharePercentageToSafe', e.target.value)}
              className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              placeholder="Ex: 10"
            />
          </div>
          
          <div>
            <label htmlFor="weeklyDistributionPercentage" className="block font-medium text-gray-300 mb-1">
              Distribuição Semanal do Cofre (% do saldo acumulado):
            </label>
            <input 
              type="number" 
              id="weeklyDistributionPercentage" 
              value={settings.weeklyDistributionPercentage}
              onChange={(e) => handleChange('weeklyDistributionPercentage', e.target.value)}
              className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              placeholder="Ex: 50"
            />
          </div>

          <div>
            <label htmlFor="monthlyDistributionPercentage" className="block font-medium text-gray-300 mb-1">
              Distribuição Mensal do Cofre (% do saldo acumulado restante):
            </label>
            <input 
              type="number" 
              id="monthlyDistributionPercentage" 
              value={settings.monthlyDistributionPercentage}
              onChange={(e) => handleChange('monthlyDistributionPercentage', e.target.value)}
              className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              placeholder="Ex: 100"
            />
          </div>
        </div>

        <div className="mt-6 p-3 bg-gray-800/50 rounded-md border border-gray-700">
            <h4 className="text-sm font-semibold text-azul-ciano mb-1.5">Observação sobre a Divisão do Revenue Share:</h4>
            <p className="text-xs text-gray-400">
                O Revenue Share total gerado é dividido da seguinte forma:
            </p>
            <ul className="list-disc list-inside text-xs text-gray-400 pl-2 mt-1 space-y-0.5">
                <li>Uma parte é paga diretamente ao afiliado (conforme seu level e regras de RevShare).</li>
                <li>Uma parte ({settings.revSharePercentageToSafe || 'X'}%) é destinada a este Cofre de Comissões.</li>
                <li>O restante do Revenue Share que não for destinado ao cofre de comissões irá para os valores de financiamento dos Rankings.</li>
            </ul>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSave}
            className="px-6 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
          >
            Salvar Configurações do Cofre
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommissionSafeSettings;

