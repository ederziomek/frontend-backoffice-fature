import React, { useState } from 'react';

interface FinancialSettingsData {
  minWithdrawal: number | string;
  maxDailyWithdrawal: number | string;
  maxWeeklyWithdrawal: number | string;
  maxMonthlyWithdrawal: number | string;
  // withdrawalFees: { method: string; feeType: 'fixed' | 'percentage'; value: number | string }[]; // Omitted as per user feedback
  // defaultCurrency: string; // Assuming BRL as per docs, can be made configurable if needed later
}

const initialSettings: FinancialSettingsData = {
  minWithdrawal: '',
  maxDailyWithdrawal: '',
  maxWeeklyWithdrawal: '',
  maxMonthlyWithdrawal: '',
};

const FinancialSettings: React.FC = () => {
  const [settings, setSettings] = useState<FinancialSettingsData>(initialSettings);

  const handleChange = (field: keyof FinancialSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving Financial Settings (mock):', settings);
    alert('Configurações Financeiras Globais salvas (mock)!');
  };

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[400px]">
      <h2 className="text-xl lg:text-2xl font-semibold text-branco mb-6 font-sora">Configurações Financeiras Globais</h2>
      
      <div className="p-4 md:p-6 bg-cinza-escuro rounded-lg shadow">
        <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Limites de Saque (Globais)</h3>
        <p className="text-xs text-gray-400 mb-4">Defina os limites globais para saques de comissões dos afiliados.</p>

        <div className="space-y-4 text-sm">
          <div>
            <label htmlFor="minWithdrawal" className="block font-medium text-gray-300 mb-1">Valor Mínimo para Saque (R$):</label>
            <input 
              type="number" 
              id="minWithdrawal" 
              value={settings.minWithdrawal}
              onChange={(e) => handleChange('minWithdrawal', e.target.value)}
              className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              placeholder="Ex: 50"
            />
          </div>
          <div>
            <label htmlFor="maxDailyWithdrawal" className="block font-medium text-gray-300 mb-1">Valor Máximo de Saque Diário (R$):</label>
            <input 
              type="number" 
              id="maxDailyWithdrawal" 
              value={settings.maxDailyWithdrawal}
              onChange={(e) => handleChange('maxDailyWithdrawal', e.target.value)}
              className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              placeholder="Ex: 1000"
            />
          </div>
          <div>
            <label htmlFor="maxWeeklyWithdrawal" className="block font-medium text-gray-300 mb-1">Valor Máximo de Saque Semanal (R$):</label>
            <input 
              type="number" 
              id="maxWeeklyWithdrawal" 
              value={settings.maxWeeklyWithdrawal}
              onChange={(e) => handleChange('maxWeeklyWithdrawal', e.target.value)}
              className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              placeholder="Ex: 5000"
            />
          </div>
          <div>
            <label htmlFor="maxMonthlyWithdrawal" className="block font-medium text-gray-300 mb-1">Valor Máximo de Saque Mensal (R$):</label>
            <input 
              type="number" 
              id="maxMonthlyWithdrawal" 
              value={settings.maxMonthlyWithdrawal}
              onChange={(e) => handleChange('maxMonthlyWithdrawal', e.target.value)}
              className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              placeholder="Ex: 20000"
            />
          </div>
        </div>
        
        {/* Taxas de Saque - Omitido conforme feedback do usuário para o mockup */}
        {/* 
        <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mt-8 mb-4">Taxas de Saque</h3>
        <p className="text-xs text-gray-400 mb-4">Configuração de taxas de saque foi omitida para este mockup.</p>
        */}

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSave}
            className="px-6 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
          >
            Salvar Limites de Saque
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 md:p-6 bg-cinza-escuro rounded-lg shadow">
        <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-2">Moeda Padrão do Sistema</h3>
        <p className="text-sm text-gray-300">A moeda padrão do sistema é: <span className="font-semibold text-branco">BRL (Real Brasileiro)</span>.</p>
        <p className="text-xs text-gray-400 mt-1">Esta configuração é informativa neste mockup.</p>
      </div>

    </div>
  );
};

export default FinancialSettings;

