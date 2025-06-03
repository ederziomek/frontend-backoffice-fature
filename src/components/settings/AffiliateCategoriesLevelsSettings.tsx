import React, { useState } from 'react';

interface Level {
  id: string;
  name: string;
  requirements: {
    minReferrals: number;
    maxReferrals: number;
  };
  benefits: {
    revTotal: number;
    revLevel1: number;
    revLevels2to5: number;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
  levels: Level[];
}

// Dados baseados no documento "Comissões do Fature.docx"
const initialCategories: Category[] = [
  {
    id: 'jogador',
    name: 'Jogador',
    description: 'Categoria inicial para novos afiliados',
    levels: [
      {
        id: 'jogador_1',
        name: 'Level 1',
        requirements: { minReferrals: 0, maxReferrals: 4 },
        benefits: { revTotal: 5.00, revLevel1: 1.00, revLevels2to5: 1.00 }
      },
      {
        id: 'jogador_2',
        name: 'Level 2',
        requirements: { minReferrals: 5, maxReferrals: 10 },
        benefits: { revTotal: 10.00, revLevel1: 6.00, revLevels2to5: 1.00 }
      }
    ]
  },
  {
    id: 'iniciante',
    name: 'Iniciante',
    description: 'Categoria para afiliados com primeiras indicações',
    levels: [
      {
        id: 'iniciante_1',
        name: 'Level 1',
        requirements: { minReferrals: 11, maxReferrals: 20 },
        benefits: { revTotal: 14.00, revLevel1: 6.00, revLevels2to5: 2.00 }
      },
      {
        id: 'iniciante_2',
        name: 'Level 2',
        requirements: { minReferrals: 21, maxReferrals: 30 },
        benefits: { revTotal: 20.00, revLevel1: 12.00, revLevels2to5: 2.00 }
      }
    ]
  },
  {
    id: 'afiliado',
    name: 'Afiliado',
    description: 'Categoria intermediária com múltiplos levels',
    levels: [
      {
        id: 'afiliado_1',
        name: 'Level 1',
        requirements: { minReferrals: 31, maxReferrals: 40 },
        benefits: { revTotal: 24.00, revLevel1: 12.00, revLevels2to5: 3.00 }
      },
      {
        id: 'afiliado_2',
        name: 'Level 2',
        requirements: { minReferrals: 41, maxReferrals: 50 },
        benefits: { revTotal: 25.00, revLevel1: 13.00, revLevels2to5: 3.00 }
      },
      {
        id: 'afiliado_3',
        name: 'Level 3',
        requirements: { minReferrals: 51, maxReferrals: 60 },
        benefits: { revTotal: 26.00, revLevel1: 14.00, revLevels2to5: 3.00 }
      },
      {
        id: 'afiliado_4',
        name: 'Level 4',
        requirements: { minReferrals: 61, maxReferrals: 70 },
        benefits: { revTotal: 27.00, revLevel1: 15.00, revLevels2to5: 3.00 }
      },
      {
        id: 'afiliado_5',
        name: 'Level 5',
        requirements: { minReferrals: 71, maxReferrals: 80 },
        benefits: { revTotal: 28.00, revLevel1: 16.00, revLevels2to5: 3.00 }
      },
      {
        id: 'afiliado_6',
        name: 'Level 6',
        requirements: { minReferrals: 81, maxReferrals: 90 },
        benefits: { revTotal: 29.00, revLevel1: 17.00, revLevels2to5: 3.00 }
      },
      {
        id: 'afiliado_7',
        name: 'Level 7',
        requirements: { minReferrals: 91, maxReferrals: 100 },
        benefits: { revTotal: 30.00, revLevel1: 18.00, revLevels2to5: 3.00 }
      }
    ]
  },
  {
    id: 'profissional',
    name: 'Profissional',
    description: 'Categoria avançada com 30 levels (101-1.000 indicações)',
    levels: [
      {
        id: 'profissional_1',
        name: 'Level 1',
        requirements: { minReferrals: 101, maxReferrals: 130 },
        benefits: { revTotal: 34.00, revLevel1: 18.00, revLevels2to5: 4.00 }
      },
      {
        id: 'profissional_5',
        name: 'Level 5',
        requirements: { minReferrals: 221, maxReferrals: 250 },
        benefits: { revTotal: 34.83, revLevel1: 18.83, revLevels2to5: 4.00 }
      },
      {
        id: 'profissional_15',
        name: 'Level 15',
        requirements: { minReferrals: 521, maxReferrals: 550 },
        benefits: { revTotal: 36.90, revLevel1: 20.90, revLevels2to5: 4.00 }
      },
      {
        id: 'profissional_30',
        name: 'Level 30',
        requirements: { minReferrals: 971, maxReferrals: 1000 },
        benefits: { revTotal: 40.00, revLevel1: 24.00, revLevels2to5: 4.00 }
      }
    ]
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Categoria expert com 90 levels (1.001-10.000 indicações)',
    levels: [
      {
        id: 'expert_1',
        name: 'Level 1',
        requirements: { minReferrals: 1001, maxReferrals: 1100 },
        benefits: { revTotal: 44.00, revLevel1: 24.00, revLevels2to5: 5.00 }
      },
      {
        id: 'expert_45',
        name: 'Level 45',
        requirements: { minReferrals: 5401, maxReferrals: 5500 },
        benefits: { revTotal: 46.97, revLevel1: 26.97, revLevels2to5: 5.00 }
      },
      {
        id: 'expert_90',
        name: 'Level 90',
        requirements: { minReferrals: 9901, maxReferrals: 10000 },
        benefits: { revTotal: 50.00, revLevel1: 30.00, revLevels2to5: 5.00 }
      }
    ]
  },
  {
    id: 'mestre',
    name: 'Mestre',
    description: 'Categoria mestre com 90 levels (10.001-100.000 indicações)',
    levels: [
      {
        id: 'mestre_1',
        name: 'Level 1',
        requirements: { minReferrals: 10001, maxReferrals: 11000 },
        benefits: { revTotal: 54.00, revLevel1: 30.00, revLevels2to5: 6.00 }
      },
      {
        id: 'mestre_45',
        name: 'Level 45',
        requirements: { minReferrals: 54001, maxReferrals: 55000 },
        benefits: { revTotal: 56.97, revLevel1: 32.97, revLevels2to5: 6.00 }
      },
      {
        id: 'mestre_90',
        name: 'Level 90',
        requirements: { minReferrals: 99001, maxReferrals: 100000 },
        benefits: { revTotal: 60.00, revLevel1: 36.00, revLevels2to5: 6.00 }
      }
    ]
  },
  {
    id: 'lenda',
    name: 'Lenda',
    description: 'Categoria máxima com 90 levels (100.001+ indicações)',
    levels: [
      {
        id: 'lenda_1',
        name: 'Level 1',
        requirements: { minReferrals: 100001, maxReferrals: 110000 },
        benefits: { revTotal: 60.00, revLevel1: 36.00, revLevels2to5: 6.00 }
      },
      {
        id: 'lenda_45',
        name: 'Level 45',
        requirements: { minReferrals: 540001, maxReferrals: 550000 },
        benefits: { revTotal: 66.97, revLevel1: 38.97, revLevels2to5: 7.00 }
      },
      {
        id: 'lenda_90',
        name: 'Level 90',
        requirements: { minReferrals: 990001, maxReferrals: 999999999 },
        benefits: { revTotal: 70.00, revLevel1: 42.00, revLevels2to5: 7.00 }
      }
    ]
  }
];

const AffiliateCategoriesLevelsSettings: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('jogador');

  const handleLevelFieldChange = (categoryIndex: number, levelIndex: number, section: 'requirements' | 'benefits', field: string, value: string | number) => {
    const newCategories = JSON.parse(JSON.stringify(categories));
    (newCategories[categoryIndex].levels[levelIndex][section] as any)[field] = typeof value === 'string' ? parseFloat(value) || 0 : value;
    setCategories(newCategories);
  };

  const addLevel = (categoryIndex: number) => {
    const newCategories = [...categories];
    const category = newCategories[categoryIndex];
    const lastLevel = category.levels[category.levels.length - 1];
    const newLevelNumber = category.levels.length + 1;
    
    const newLevel: Level = {
      id: `${category.id}_${newLevelNumber}`,
      name: `Level ${newLevelNumber}`,
      requirements: { 
        minReferrals: lastLevel ? lastLevel.requirements.maxReferrals + 1 : 0, 
        maxReferrals: lastLevel ? lastLevel.requirements.maxReferrals + 100 : 100 
      },
      benefits: { revTotal: 0, revLevel1: 0, revLevels2to5: 0 },
    };
    
    newCategories[categoryIndex].levels.push(newLevel);
    setCategories(newCategories);
  };

  const removeLevel = (categoryIndex: number, levelIndex: number) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].levels.splice(levelIndex, 1);
    setCategories(newCategories);
  };

  const handleSave = () => {
    console.log('Saving Categories and Levels:', categories);
    alert('Configurações de Categorias e Levels salvas com sucesso!');
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[400px]">
      <h2 className="text-xl lg:text-2xl font-semibold text-branco mb-6 font-sora">
        Gerenciamento de Categorias e Levels de Afiliados
      </h2>
      
      {/* Seletor de Categoria */}
      <div className="mb-6 p-4 bg-cinza-escuro rounded-lg">
        <h3 className="text-lg font-semibold text-azul-ciano mb-4">Selecionar Categoria</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-2 rounded text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-azul-ciano text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Informações da Categoria Selecionada */}
      {selectedCategoryData && (
        <div className="mb-6 p-4 bg-cinza-escuro rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-azul-ciano">{selectedCategoryData.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{selectedCategoryData.description}</p>
              <p className="text-sm text-gray-300 mt-2">
                <strong>Total de Levels:</strong> {selectedCategoryData.levels.length}
              </p>
            </div>
            <button 
              onClick={() => addLevel(categories.findIndex(cat => cat.id === selectedCategory))}
              className="px-4 py-2 text-sm font-medium text-azul-ciano bg-transparent border border-azul-ciano rounded-md hover:bg-azul-ciano hover:text-white transition-colors"
            >
              Adicionar Level
            </button>
          </div>

          {/* Levels da Categoria */}
          <div className="space-y-4">
            {selectedCategoryData.levels.map((level, levelIndex) => {
              const categoryIndex = categories.findIndex(cat => cat.id === selectedCategory);
              return (
                <div key={level.id} className="p-4 border border-gray-700 rounded-lg bg-gray-800/30">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-medium text-branco">{level.name}</h4>
                    <button 
                      onClick={() => removeLevel(categoryIndex, levelIndex)}
                      className="text-red-500 hover:text-red-400 text-sm px-2 py-1 rounded border border-red-500 hover:bg-red-500/10"
                    >
                      Remover
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Requisitos */}
                    <div>
                      <h5 className="font-medium text-gray-300 mb-3">Requisitos</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Indicações Mínimas:</label>
                          <input 
                            type="number" 
                            value={level.requirements.minReferrals}
                            onChange={(e) => handleLevelFieldChange(categoryIndex, levelIndex, 'requirements', 'minReferrals', e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Indicações Máximas:</label>
                          <input 
                            type="number" 
                            value={level.requirements.maxReferrals}
                            onChange={(e) => handleLevelFieldChange(categoryIndex, levelIndex, 'requirements', 'maxReferrals', e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Benefícios */}
                    <div>
                      <h5 className="font-medium text-gray-300 mb-3">Comissões RevShare (%)</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">RevShare Total:</label>
                          <input 
                            type="number" 
                            value={level.benefits.revTotal}
                            onChange={(e) => handleLevelFieldChange(categoryIndex, levelIndex, 'benefits', 'revTotal', e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">RevShare Nível 1:</label>
                          <input 
                            type="number" 
                            value={level.benefits.revLevel1}
                            onChange={(e) => handleLevelFieldChange(categoryIndex, levelIndex, 'benefits', 'revLevel1', e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">RevShare Níveis 2-5 (cada):</label>
                          <input 
                            type="number" 
                            value={level.benefits.revLevels2to5}
                            onChange={(e) => handleLevelFieldChange(categoryIndex, levelIndex, 'benefits', 'revLevels2to5', e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          className="px-6 py-3 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80 transition-colors"
        >
          Salvar Todas as Configurações
        </button>
      </div>
    </div>
  );
};

export default AffiliateCategoriesLevelsSettings;

