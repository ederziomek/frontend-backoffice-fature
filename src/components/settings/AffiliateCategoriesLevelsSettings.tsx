import React, { useState } from 'react';

interface Level {
  id: string;
  name: string;
  requirements: {
    directReferrals: number | string;
    networkGGR: number | string;
    networkDeposits: number | string;
  };
  benefits: {
    revShareLevel1: number | string;
    revShareLevel2_5: number | string; // Could be an array or object for individual levels
    levelUpReward: number | string;
  };
}

interface Category {
  id: string;
  name: string;
  levels: Level[];
}

const initialCategories: Category[] = [
  { id: 'jogador', name: 'Jogador', levels: [] },
  { id: 'iniciante', name: 'Iniciante', levels: [] },
  { id: 'afiliado', name: 'Afiliado', levels: [] },
  { id: 'profissional', name: 'Profissional', levels: [] },
  { id: 'expert', name: 'Expert', levels: [] },
  { id: 'mestre', name: 'Mestre', levels: [] },
  { id: 'lenda', name: 'Lenda', levels: [] },
];

const AffiliateCategoriesLevelsSettings: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // const handleLevelChange = (categoryIndex: number, levelIndex: number, field: keyof Level["requirements"] | keyof Level["benefits"], value: string, subField?: keyof Level["requirements"] | keyof Level["benefits"]) => {
    // const newCategories = [...categories];
    // const level = newCategories[categoryIndex].levels[levelIndex];
    // if (subField) {
    //   (level[field as keyof (Level["requirements"] | Level["benefits")] as any)[subField] = value;
    // } else {
    //   (level as any)[field] = value;
    // }
    // setCategories(newCategories);
  // };;
  
  const handleLevelFieldChange = (categoryIndex: number, levelIndex: number, section: 'requirements' | 'benefits', field: string, value: string | number) => {
    const newCategories = JSON.parse(JSON.stringify(categories)); // Deep copy
    (newCategories[categoryIndex].levels[levelIndex][section] as any)[field] = value;
    setCategories(newCategories);
  };

  const addLevel = (categoryIndex: number) => {
    const newCategories = [...categories];
    const newLevelId = `level-${newCategories[categoryIndex].levels.length + 1}`;
    newCategories[categoryIndex].levels.push({
      id: newLevelId,
      name: `Level ${newCategories[categoryIndex].levels.length + 1}`,
      requirements: { directReferrals: '', networkGGR: '', networkDeposits: '' },
      benefits: { revShareLevel1: '', revShareLevel2_5: '', levelUpReward: '' },
    });
    setCategories(newCategories);
  };

  const removeLevel = (categoryIndex: number, levelIndex: number) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].levels.splice(levelIndex, 1);
    // Re-assign names if needed or keep IDs static
    newCategories[categoryIndex].levels.forEach((level, index) => {
      level.name = `Level ${index + 1}`;
    });
    setCategories(newCategories);
  };

  const handleSave = () => {
    console.log('Saving Categories and Levels (mock):', categories);
    alert('Configurações de Categorias e Levels salvas (mock)!');
  };

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[400px]">
      <h2 className="text-xl lg:text-2xl font-semibold text-branco mb-6 font-sora">Gerenciamento de Categorias e Levels de Afiliados</h2>
      
      <div className="space-y-8">
        {categories.map((category, catIndex) => (
          <div key={category.id} className="p-4 md:p-6 bg-cinza-escuro rounded-lg shadow">
            <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Categoria: {category.name}</h3>
            
            {category.levels.map((level, lvlIndex) => (
              <div key={level.id} className="mb-6 p-3 md:p-4 border border-gray-700 rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md lg:text-lg font-medium text-branco">{level.name}</h4>
                  <button 
                    onClick={() => removeLevel(catIndex, lvlIndex)}
                    className="text-red-500 hover:text-red-400 text-xs p-1 rounded"
                  >
                    Remover Level
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-300 mb-1">Requisitos:</p>
                    <label className="block text-xs text-gray-400 mt-2">Indicações Diretas Válidas:</label>
                    <input 
                      type="number" 
                      value={level.requirements.directReferrals}
                      onChange={(e) => handleLevelFieldChange(catIndex, lvlIndex, 'requirements', 'directReferrals', e.target.value)}
                      className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-xs"
                    />
                    <label className="block text-xs text-gray-400 mt-2">GGR da Rede (Período X):</label>
                    <input 
                      type="number" 
                      value={level.requirements.networkGGR}
                      onChange={(e) => handleLevelFieldChange(catIndex, lvlIndex, 'requirements', 'networkGGR', e.target.value)}
                      className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-xs"
                    />
                    <label className="block text-xs text-gray-400 mt-2">Volume de Depósitos da Rede:</label>
                    <input 
                      type="number" 
                      value={level.requirements.networkDeposits}
                      onChange={(e) => handleLevelFieldChange(catIndex, lvlIndex, 'requirements', 'networkDeposits', e.target.value)}
                      className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-xs"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-300 mb-1">Benefícios/Comissões:</p>
                    <label className="block text-xs text-gray-400 mt-2">% RevShare Nível 1:</label>
                    <input 
                      type="number" 
                      value={level.benefits.revShareLevel1}
                      onChange={(e) => handleLevelFieldChange(catIndex, lvlIndex, 'benefits', 'revShareLevel1', e.target.value)}
                      className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-xs"
                    />
                    <label className="block text-xs text-gray-400 mt-2">% RevShare Nível 2-5 (ou por nível):</label>
                    <input 
                      type="text" // Can be text to accommodate ranges or individual values like "5,4,3,2"
                      value={level.benefits.revShareLevel2_5}
                      onChange={(e) => handleLevelFieldChange(catIndex, lvlIndex, 'benefits', 'revShareLevel2_5', e.target.value)}
                      className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-xs"
                      placeholder="Ex: 5 ou 5,4,3,2"
                    />
                    <label className="block text-xs text-gray-400 mt-2">Recompensa por Atingir o Level (R$):</label>
                    <input 
                      type="number" 
                      value={level.benefits.levelUpReward}
                      onChange={(e) => handleLevelFieldChange(catIndex, lvlIndex, 'benefits', 'levelUpReward', e.target.value)}
                      className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => addLevel(catIndex)}
              className="mt-2 px-3 py-1.5 text-xs font-medium text-azul-ciano bg-cinza-escuro rounded-md hover:bg-gray-700 border border-azul-ciano"
            >
              Adicionar Novo Level em {category.name}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSave}
          className="px-6 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
        >
          Salvar Todas as Configurações
        </button>
      </div>
    </div>
  );
};

export default AffiliateCategoriesLevelsSettings;

