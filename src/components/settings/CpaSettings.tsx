import React, { useState } from 'react';

interface CpaLevelValue {
  level: number;
  value: number | string;
}

interface CpaValidationRule {
  id: string;
  name: string;
  description: string;
  value: number | string;
  enabled: boolean;
}

const initialCpaValues: CpaLevelValue[] = [
  { level: 1, value: '' },
  { level: 2, value: '' },
  { level: 3, value: '' },
  { level: 4, value: '' },
  { level: 5, value: '' },
];

const initialValidationRules: CpaValidationRule[] = [
  {
    id: 'valorDepositado',
    name: 'Valor Depositado (Soma)',
    description: 'Soma total dos valores depositados pelo novo jogador.',
    value: '',
    enabled: true,
  },
  {
    id: 'quantidadeApostas',
    name: 'Quantidade de Apostas Realizadas',
    description: 'Número mínimo de apostas que o novo jogador deve realizar.',
    value: '',
    enabled: true,
  },
  {
    id: 'ggrGerado',
    name: 'GGR Gerado',
    description: 'GGR (Gross Gaming Revenue) mínimo que o novo jogador deve gerar.',
    value: '',
    enabled: true,
  },
];

const CpaSettings: React.FC = () => {
  const [cpaValues, setCpaValues] = useState<CpaLevelValue[]>(initialCpaValues);
  const [validationRules, setValidationRules] = useState<CpaValidationRule[]>(initialValidationRules);

  const handleCpaValueChange = (index: number, newValue: string) => {
    const updatedValues = [...cpaValues];
    updatedValues[index].value = newValue;
    setCpaValues(updatedValues);
  };

  const handleRuleValueChange = (index: number, newValue: string) => {
    const updatedRules = [...validationRules];
    updatedRules[index].value = newValue;
    setValidationRules(updatedRules);
  };

  const handleRuleToggle = (index: number) => {
    const updatedRules = [...validationRules];
    updatedRules[index].enabled = !updatedRules[index].enabled;
    setValidationRules(updatedRules);
  };

  const handleSaveCpaValues = () => {
    console.log('Saving CPA Values (mock):', cpaValues);
    alert('Configurações de Valores de CPA salvas (mock)!');
  };

  const handleSaveValidationRules = () => {
    console.log('Saving CPA Validation Rules (mock):', validationRules);
    alert('Regras de Validação de CPA salvas (mock)!');
  };

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[400px]">
      <h2 className="text-xl lg:text-2xl font-semibold text-branco mb-6 font-sora">Gerenciamento de CPA</h2>

      <div className="mb-8 p-4 md:p-6 bg-cinza-escuro rounded-lg shadow">
        <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Valores de CPA por Nível da Rede</h3>
        <div className="space-y-3">
          {cpaValues.map((cpa, index) => (
            <div key={cpa.level} className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label htmlFor={`cpaLevel${cpa.level}`} className="block text-sm font-medium text-gray-300 mb-1 sm:mb-0 sm:w-1/4">
                CPA Nível {cpa.level} (R$):
              </label>
              <input
                type="number"
                id={`cpaLevel${cpa.level}`}
                value={cpa.value}
                onChange={(e) => handleCpaValueChange(index, e.target.value)}
                className="w-full sm:w-3/4 p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                placeholder="Ex: 50"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveCpaValues}
            className="px-5 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
          >
            Salvar Valores de CPA
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 bg-cinza-escuro rounded-lg shadow">
        <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Regras de Validação de CPA</h3>
        <p className="text-xs text-gray-400 mb-4">Configure os critérios que um novo jogador indicado deve cumprir para que a comissão CPA seja considerada válida.</p>
        <div className="space-y-4">
          {validationRules.map((rule, index) => (
            <div key={rule.id} className="p-3 border border-gray-700 rounded-md bg-gray-800/30">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-md font-medium text-branco">{rule.name}</h4>
                <button 
                    onClick={() => handleRuleToggle(index)}
                    className={`px-2 py-0.5 text-xs rounded-full ${rule.enabled ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'} text-white`}
                >
                    {rule.enabled ? 'Ativa' : 'Inativa'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-2">{rule.description}</p>
              <input
                type="number"
                value={rule.value}
                onChange={(e) => handleRuleValueChange(index, e.target.value)}
                disabled={!rule.enabled}
                className={`w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-xs ${!rule.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder={rule.id === 'valorDepositado' || rule.id === 'ggrGerado' ? 'Valor em R$' : 'Quantidade'}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveValidationRules}
            className="px-5 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
          >
            Salvar Regras de Validação
          </button>
        </div>
      </div>
    </div>
  );
};

export default CpaSettings;

