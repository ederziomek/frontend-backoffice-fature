import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Save, RotateCcw } from 'lucide-react';

// VERSÃO 4.0 - ATUALIZAÇÃO PARA REVSHARE MLM POR CATEGORIA
// Componente para gerenciamento de categorias e levels de afiliados - v4.0
interface Level {
  id: string;
  name: string;
  requirements: {
    minReferrals: number;
    maxReferrals: number;
  };
  benefits: {
    revLevel1: number;
    levelUpBonus: number;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
  revLevels2to5: number; // RevShare único para níveis 2-5 da categoria
  levels: Level[];
}

// Configurações completas baseadas na documentação oficial
const getCompleteCategories = (): Category[] => [
  {
    id: 'jogador',
    name: 'Jogador',
    description: 'Categoria inicial para novos afiliados (0-10 indicações)',
    revLevels2to5: 1.00, // 1% para níveis 2-5
    levels: [
      {
        id: 'jogador_1',
        name: 'Level 1',
        requirements: { minReferrals: 0, maxReferrals: 5 },
        benefits: { revLevel1: 1.00, levelUpBonus: 25 } // R$ 25 conforme documento
      },
      {
        id: 'jogador_2',
        name: 'Level 2',
        requirements: { minReferrals: 6, maxReferrals: 10 },
        benefits: { revLevel1: 6.00, levelUpBonus: 25 } // R$ 25 conforme documento
      }
    ]
  },
  {
    id: 'iniciante',
    name: 'Iniciante',
    description: 'Categoria para afiliados com primeiras indicações (11-30 indicações)',
    revLevels2to5: 2.00, // 2% para níveis 2-5
    levels: [
      {
        id: 'iniciante_1',
        name: 'Level 1',
        requirements: { minReferrals: 11, maxReferrals: 20 },
        benefits: { revLevel1: 6.00, levelUpBonus: 50 } // R$ 50 conforme documento
      },
      {
        id: 'iniciante_2',
        name: 'Level 2',
        requirements: { minReferrals: 21, maxReferrals: 30 },
        benefits: { revLevel1: 12.00, levelUpBonus: 50 } // R$ 50 conforme documento
      }
    ]
  },
  {
    id: 'afiliado',
    name: 'Afiliado',
    description: 'Categoria intermediária com múltiplos levels (31-100 indicações)',
    revLevels2to5: 3.00, // 3% para níveis 2-5
    levels: [
      {
        id: 'afiliado_1',
        name: 'Level 1',
        requirements: { minReferrals: 31, maxReferrals: 40 },
        benefits: { revLevel1: 12.00, levelUpBonus: 50 } // R$ 50 conforme documento
      },
      {
        id: 'afiliado_2',
        name: 'Level 2',
        requirements: { minReferrals: 41, maxReferrals: 50 },
        benefits: { revLevel1: 13.00, levelUpBonus: 50 }
      },
      {
        id: 'afiliado_3',
        name: 'Level 3',
        requirements: { minReferrals: 51, maxReferrals: 60 },
        benefits: { revLevel1: 14.00, levelUpBonus: 50 }
      },
      {
        id: 'afiliado_4',
        name: 'Level 4',
        requirements: { minReferrals: 61, maxReferrals: 70 },
        benefits: { revLevel1: 15.00, levelUpBonus: 50 }
      },
      {
        id: 'afiliado_5',
        name: 'Level 5',
        requirements: { minReferrals: 71, maxReferrals: 80 },
        benefits: { revLevel1: 16.00, levelUpBonus: 50 }
      },
      {
        id: 'afiliado_6',
        name: 'Level 6',
        requirements: { minReferrals: 81, maxReferrals: 90 },
        benefits: { revLevel1: 17.00, levelUpBonus: 50 }
      },
      {
        id: 'afiliado_7',
        name: 'Level 7',
        requirements: { minReferrals: 91, maxReferrals: 100 },
        benefits: { revLevel1: 18.00, levelUpBonus: 50 }
      }
    ]
  },
  {
    id: 'profissional',
    name: 'Profissional',
    description: 'Categoria avançada com 90 levels (101-1.000 indicações)',
    revLevels2to5: 4.00, // 4% para níveis 2-5
    levels: generateProfessionalLevels()
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Categoria expert com 90 levels (1.001-10.000 indicações)',
    revLevels2to5: 5.00, // 5% para níveis 2-5
    levels: generateExpertLevels()
  },
  {
    id: 'mestre',
    name: 'Mestre',
    description: 'Categoria mestre com 90 levels (10.001-100.000 indicações)',
    revLevels2to5: 6.00, // 6% para níveis 2-5
    levels: generateMestreLevels()
  },
  {
    id: 'lenda',
    name: 'Lenda',
    description: 'Categoria máxima com 90 levels (100.001+ indicações)',
    revLevels2to5: 7.00, // 7% para níveis 2-5
    levels: generateLendaLevels()
  }
];

// Função para gerar levels da categoria Profissional
function generateProfessionalLevels(): Level[] {
  const levels: Level[] = [];
  for (let i = 1; i <= 90; i++) {
    const minReferrals = 101 + (i - 1) * 10;
    const maxReferrals = 100 + i * 10;
    const revLevel1 = 18.00 + (i - 1) * 0.067;
    
    levels.push({
      id: `profissional_${i}`,
      name: `Level ${i}`,
      requirements: { minReferrals, maxReferrals },
      benefits: { 
        revLevel1: Math.round(revLevel1 * 100) / 100, 
        levelUpBonus: 500 // R$ 500 conforme documento
      }
    });
  }
  return levels;
}

// Função para gerar levels da categoria Expert
function generateExpertLevels(): Level[] {
  const levels: Level[] = [];
  for (let i = 1; i <= 90; i++) {
    const minReferrals = 1001 + (i - 1) * 100;
    const maxReferrals = 1000 + i * 100;
    const revLevel1 = 24.00 + (i - 1) * 0.067;
    
    levels.push({
      id: `expert_${i}`,
      name: `Level ${i}`,
      requirements: { minReferrals, maxReferrals },
      benefits: { 
        revLevel1: Math.round(revLevel1 * 100) / 100, 
        levelUpBonus: 500 // R$ 500 conforme documento
      }
    });
  }
  return levels;
}

// Função para gerar levels da categoria Mestre
function generateMestreLevels(): Level[] {
  const levels: Level[] = [];
  for (let i = 1; i <= 90; i++) {
    const minReferrals = 10001 + (i - 1) * 1000;
    const maxReferrals = 10000 + i * 1000;
    const revLevel1 = 30.00 + (i - 1) * 0.067;
    
    levels.push({
      id: `mestre_${i}`,
      name: `Level ${i}`,
      requirements: { minReferrals, maxReferrals },
      benefits: { 
        revLevel1: Math.round(revLevel1 * 100) / 100, 
        levelUpBonus: 5000 // R$ 5.000 conforme documento
      }
    });
  }
  return levels;
}

// Função para gerar levels da categoria Lenda
function generateLendaLevels(): Level[] {
  const levels: Level[] = [];
  for (let i = 1; i <= 90; i++) {
    const minReferrals = 100001 + (i - 1) * 1000;
    const maxReferrals = i === 90 ? 999999999 : 100000 + i * 1000;
    
    levels.push({
      id: `lenda_${i}`,
      name: `Level ${i}`,
      requirements: { minReferrals, maxReferrals },
      benefits: { 
        revLevel1: 42.00, 
        levelUpBonus: 5000 // R$ 5.000 conforme documento
      }
    });
  }
  return levels;
}

const CategoriesLevelsManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('jogador');
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [currentPage, setCurrentPage] = useState(1);
  const levelsPerPage = 10;

  // Inicializar com configurações completas
  useEffect(() => {
    setCategories(getCompleteCategories());
  }, []);

  const handleCategoryRevShareChange = (categoryIndex: number, value: string) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].revLevels2to5 = parseFloat(value) || 0;
    setCategories(newCategories);
  };

  const handleLevelFieldChange = (
    categoryIndex: number, 
    levelIndex: number, 
    section: 'requirements' | 'benefits', 
    field: string, 
    value: string | number
  ) => {
    const newCategories = JSON.parse(JSON.stringify(categories));
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    (newCategories[categoryIndex].levels[levelIndex][section] as any)[field] = numValue;
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
      benefits: { revLevel1: 0, levelUpBonus: 0 },
    };
    
    newCategories[categoryIndex].levels.push(newLevel);
    setCategories(newCategories);
  };

  const removeLevel = (categoryIndex: number, levelIndex: number) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].levels.splice(levelIndex, 1);
    setCategories(newCategories);
  };

  const toggleLevelExpansion = (levelId: string) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(levelId)) {
      newExpanded.delete(levelId);
    } else {
      newExpanded.add(levelId);
    }
    setExpandedLevels(newExpanded);
  };

  const resetToDefaults = () => {
    if (confirm('Tem certeza que deseja restaurar todas as configurações padrão? Esta ação não pode ser desfeita.')) {
      setCategories(getCompleteCategories());
      setSaveStatus('idle');
      setExpandedLevels(new Set());
      setCurrentPage(1);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setIsLoading(true);
    
    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Saving Categories and Levels:', categories);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
  
  // Paginação
  const totalLevels = selectedCategoryData?.levels.length || 0;
  const totalPages = Math.ceil(totalLevels / levelsPerPage);
  const startIndex = (currentPage - 1) * levelsPerPage;
  const endIndex = startIndex + levelsPerPage;
  const currentLevels = selectedCategoryData?.levels.slice(startIndex, endIndex) || [];

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving': return 'Salvando...';
      case 'success': return 'Salvo com Sucesso!';
      case 'error': return 'Erro ao Salvar';
      default: return 'Salvar Todas as Configurações';
    }
  };

  const getSaveButtonClass = () => {
    const baseClass = "px-6 py-3 text-sm font-bold rounded-md transition-colors flex items-center gap-2 ";
    switch (saveStatus) {
      case 'saving': return baseClass + "text-gray-400 bg-gray-600 cursor-not-allowed";
      case 'success': return baseClass + "text-white bg-green-600 hover:bg-green-700";
      case 'error': return baseClass + "text-white bg-red-600 hover:bg-red-700";
      default: return baseClass + "text-branco bg-azul-ciano hover:bg-opacity-80";
    }
  };

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl lg:text-2xl font-semibold text-branco font-sora">
          Gerenciamento de Categorias e Levels de Afiliados
        </h2>
        <div className="flex gap-3">
          <button 
            onClick={resetToDefaults}
            className="px-4 py-2 text-sm font-medium text-yellow-400 bg-transparent border border-yellow-400 rounded-md hover:bg-yellow-400 hover:text-gray-900 transition-colors flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Restaurar Padrões
          </button>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="mb-6 p-4 bg-cinza-escuro rounded-lg">
        <h3 className="text-lg font-semibold text-azul-ciano mb-4">Estatísticas do Sistema</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-branco">{categories.length}</div>
            <div className="text-sm text-gray-400">Categorias</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-branco">
              {categories.reduce((sum, cat) => sum + cat.levels.length, 0)}
            </div>
            <div className="text-sm text-gray-400">Total de Levels</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-branco">R$ 85,00</div>
            <div className="text-sm text-gray-400">CPA Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-branco">5</div>
            <div className="text-sm text-gray-400">Níveis MLM</div>
          </div>
        </div>
      </div>
      
      {/* Seletor de Categoria */}
      <div className="mb-6 p-4 bg-cinza-escuro rounded-lg">
        <h3 className="text-lg font-semibold text-azul-ciano mb-4">Selecionar Categoria</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentPage(1);
              }}
              className={`p-3 rounded text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-azul-ciano text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="font-semibold">{category.name}</div>
              <div className="text-xs opacity-75">{category.levels.length} levels</div>
            </button>
          ))}
        </div>
      </div>

      {/* Configurações da Categoria Selecionada */}
      {selectedCategoryData && (
        <div className="mb-6 p-4 bg-cinza-escuro rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-azul-ciano">{selectedCategoryData.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{selectedCategoryData.description}</p>
              <div className="flex gap-4 mt-3 text-sm text-gray-300">
                <span><strong>Total de Levels:</strong> {selectedCategoryData.levels.length}</span>
                <span><strong>Range:</strong> {selectedCategoryData.levels[0]?.requirements.minReferrals} - {selectedCategoryData.levels[selectedCategoryData.levels.length - 1]?.requirements.maxReferrals} indicações</span>
              </div>
            </div>
            <button 
              onClick={() => addLevel(categories.findIndex(cat => cat.id === selectedCategory))}
              className="px-4 py-2 text-sm font-medium text-azul-ciano bg-transparent border border-azul-ciano rounded-md hover:bg-azul-ciano hover:text-white transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Adicionar Level
            </button>
          </div>

          {/* Configuração RevShare MLM para a Categoria */}
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-azul-ciano">
            <h4 className="text-lg font-semibold text-azul-ciano mb-3">Configuração RevShare MLM</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  RevShare Níveis 2-5 (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={selectedCategoryData.revLevels2to5}
                  onChange={(e) => handleCategoryRevShareChange(
                    categories.findIndex(cat => cat.id === selectedCategory), 
                    e.target.value
                  )}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-azul-ciano"
                  placeholder="Ex: 3.00"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Percentual aplicado igualmente aos níveis 2, 3, 4 e 5 da rede MLM
                </p>
              </div>
              <div className="flex items-center">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-300">
                    <div><strong>Nível 1:</strong> Configurado por level individual</div>
                    <div><strong>Níveis 2-5:</strong> {selectedCategoryData.revLevels2to5}% cada</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista Compacta de Levels */}
          <div className="space-y-2">
            {currentLevels.map((level, levelIndex) => {
              const categoryIndex = categories.findIndex(cat => cat.id === selectedCategory);
              const actualLevelIndex = startIndex + levelIndex;
              const isExpanded = expandedLevels.has(level.id);
              
              return (
                <div key={level.id} className="bg-gray-800 rounded-lg border border-gray-700">
                  {/* Header Compacto */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-750 transition-colors"
                    onClick={() => toggleLevelExpansion(level.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          <span className="font-medium text-white">{level.name}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {level.requirements.minReferrals} - {level.requirements.maxReferrals} indicações
                        </div>
                        <div className="text-sm text-azul-ciano">
                          Rev: {level.benefits.revLevel1}% | Bônus: R$ {level.benefits.levelUpBonus}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLevel(categoryIndex, actualLevelIndex);
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Detalhes Expandidos */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Min. Indicações
                          </label>
                          <input
                            type="number"
                            value={level.requirements.minReferrals}
                            onChange={(e) => handleLevelFieldChange(
                              categoryIndex, actualLevelIndex, 'requirements', 'minReferrals', e.target.value
                            )}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-azul-ciano"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Máx. Indicações
                          </label>
                          <input
                            type="number"
                            value={level.requirements.maxReferrals}
                            onChange={(e) => handleLevelFieldChange(
                              categoryIndex, actualLevelIndex, 'requirements', 'maxReferrals', e.target.value
                            )}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-azul-ciano"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            RevShare Nível 1 (%)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={level.benefits.revLevel1}
                            onChange={(e) => handleLevelFieldChange(
                              categoryIndex, actualLevelIndex, 'benefits', 'revLevel1', e.target.value
                            )}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-azul-ciano"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Bônus Level Up (R$)
                          </label>
                          <input
                            type="number"
                            value={level.benefits.levelUpBonus}
                            onChange={(e) => handleLevelFieldChange(
                              categoryIndex, actualLevelIndex, 'benefits', 'levelUpBonus', e.target.value
                            )}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-azul-ciano"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-400">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      )}

      {/* Botão de Salvar */}
      <div className="flex justify-center mt-8">
        <button 
          onClick={handleSave}
          disabled={isLoading}
          className={getSaveButtonClass()}
        >
          <Save size={16} />
          {getSaveButtonText()}
        </button>
      </div>
    </div>
  );
};

export default CategoriesLevelsManager;

