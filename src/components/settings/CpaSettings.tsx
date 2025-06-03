import React, { useState } from 'react';

interface CpaLevelValue {
  level: number;
  value: number | string;
}

interface CpaValidationModel {
  id: string;
  name: string;
  description: string;
  minDeposit: number;
  minBets: number;
  minGgr: number;
  active: boolean;
}

const initialCpaValues: CpaLevelValue[] = [
  { level: 1, value: 35.00 }, // R$ 35,00 - Afiliado da indicação direta
  { level: 2, value: 10.00 }, // R$ 10,00 - Upline do nível 1
  { level: 3, value: 5.00 },  // R$ 5,00  - Upline do nível 2
  { level: 4, value: 5.00 },  // R$ 5,00  - Upline do nível 3
  { level: 5, value: 5.00 }   // R$ 5,00  - Upline do nível 4
];

const initialValidationModels: CpaValidationModel[] = [
  {
    id: 'model_1_1',
    name: 'Modelo 1.1 (Inicial)',
    description: 'Primeiro depósito mínimo de R$ 30,00 + 3 apostas + R$ 15,00 GGR',
    minDeposit: 30.00,
    minBets: 3,
    minGgr: 15.00,
    active: true,
  },
  {
    id: 'model_1_2',
    name: 'Modelo 1.2 (Alternativo)',
    description: 'Primeiro depósito mínimo de R$ 30,00 + 5 apostas + R$ 25,00 GGR',
    minDeposit: 30.00,
    minBets: 5,
    minGgr: 25.00,
    active: false,
  },
];

const CpaSettings: React.FC = () => {
  const [cpaValues, setCpaValues] = useState<CpaLevelValue[]>(initialCpaValues);
  const [validationModels, setValidationModels] = useState<CpaValidationModel[]>(initialValidationModels);
  const [totalCpaAmount, setTotalCpaAmount] = useState<number>(60.00);

  const handleCpaValueChange = (index: number, newValue: string) => {
    const updatedValues = [...cpaValues];
    updatedValues[index].value = parseFloat(newValue) || 0;
    setCpaValues(updatedValues);
  };

  const handleModelFieldChange = (index: number, field: keyof CpaValidationModel, value: any) => {
    const updatedModels = [...validationModels];
    (updatedModels[index] as any)[field] = value;
    setValidationModels(updatedModels);
  };

  const handleModelToggle = (index: number) => {
    const updatedModels = validationModels.map((model, i) => ({
      ...model,
      active: i === index // Apenas um modelo pode estar ativo
    }));
    setValidationModels(updatedModels);
  };

  const calculateTotal = () => {
    return cpaValues.reduce((sum, cpa) => sum + (parseFloat(cpa.value.toString()) || 0), 0);
  };

  const handleSaveCpaValues = () => {
    const total = calculateTotal();
    console.log('Saving CPA Values:', { cpaValues, total });
    alert(`Configurações de CPA salvas! Total: R$ ${total.toFixed(2)}`);
  };

  const handleSaveValidationModels = () => {
    const activeModel = validationModels.find(model => model.active);
    console.log('Saving CPA Validation Models:', { validationModels, activeModel });
    alert(`Modelos de validação salvos! Modelo ativo: ${activeModel?.name}`);
  };

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[400px]">
      <h2 className="text-xl lg:text-2xl font-semibold text-branco mb-6 font-sora">Gerenciamento de CPA</h2>

      {/* Informações Gerais */}
      <div className="mb-8 p-4 md:p-6 bg-cinza-escuro rounded-lg shadow">
        <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Configurações Gerais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Valor Total CPA (R$):
            </label>
            <input
              type="number"
              value={totalCpaAmount}
              onChange={(e) => setTotalCpaAmount(parseFloat(e.target.value) || 0)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Total Distribuído (R$):
            </label>
            <div className="p-2 bg-gray-700 rounded border border-gray-600 text-gray-300">
              R$ {calculateTotal().toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Distribuição por Níveis */}
      <div className="mb-8 p-4 md:p-6 bg-cinza-escuro rounded-lg shadow">
        <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Distribuição CPA por Nível da Rede</h3>
        <p className="text-sm text-gray-400 mb-4">
          Configure como o valor total de R$ {totalCpaAmount.toFixed(2)} será distribuído entre os 5 níveis da rede de afiliados.
        </p>
        <div className="space-y-3">
          {cpaValues.map((cpa, index) => (
            <div key={cpa.level} className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label htmlFor={`cpaLevel${cpa.level}`} className="block text-sm font-medium text-gray-300 mb-1 sm:mb-0 sm:w-1/3">
                Nível {cpa.level} {index === 0 ? '(Indicação Direta)' : `(Upline ${index})`}:
              </label>
              <div className="flex items-center gap-2 sm:w-2/3">
                <span className="text-gray-400">R$</span>
                <input
                  type="number"
                  id={`cpaLevel${cpa.level}`}
                  value={cpa.value}
                  onChange={(e) => handleCpaValueChange(index, e.target.value)}
                  className="flex-1 p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
                  step="0.01"
                />
                <span className="text-sm text-gray-400">
                  ({((parseFloat(cpa.value.toString()) || 0) / totalCpaAmount * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveCpaValues}
            className="px-5 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
          >
            Salvar Distribuição CPA
          </button>
        </div>
      </div>

      {/* Modelos de Validação */}
      <div className="p-4 md:p-6 bg-cinza-escuro rounded-lg shadow">
        <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Modelos de Validação CPA</h3>
        <p className="text-sm text-gray-400 mb-4">
          Configure os critérios que um novo jogador deve cumprir para validar a comissão CPA. Apenas um modelo pode estar ativo por vez.
        </p>
        <div className="space-y-4">
          {validationModels.map((model, index) => (
            <div key={model.id} className={`p-4 border rounded-lg ${model.active ? 'border-azul-ciano bg-azul-ciano/10' : 'border-gray-700 bg-gray-800/30'}`}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-md font-medium text-branco">{model.name}</h4>
                <button 
                  onClick={() => handleModelToggle(index)}
                  className={`px-3 py-1 text-xs rounded-full ${model.active ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 hover:bg-gray-500'} text-white`}
                >
                  {model.active ? 'ATIVO' : 'Ativar'}
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-4">{model.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Depósito Mínimo (R$):</label>
                  <input
                    type="number"
                    value={model.minDeposit}
                    onChange={(e) => handleModelFieldChange(index, 'minDeposit', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Apostas Mínimas:</label>
                  <input
                    type="number"
                    value={model.minBets}
                    onChange={(e) => handleModelFieldChange(index, 'minBets', parseInt(e.target.value) || 0)}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">GGR Mínimo (R$):</label>
                  <input
                    type="number"
                    value={model.minGgr}
                    onChange={(e) => handleModelFieldChange(index, 'minGgr', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-sm"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveValidationModels}
            className="px-5 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
          >
            Salvar Modelos de Validação
          </button>
        </div>
      </div>
    </div>
  );
};

export default CpaSettings;

