import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';

interface ReductionInterval {
  id: string;
  days: number;
  reductionPercentage: number;
}

interface InactivityRule {
  id: string;
  categoryName: string;
  inactivityThresholdDays: number;
  reductionIntervals: ReductionInterval[];
  isActive: boolean;
}

interface AffiliateCategory {
  id: string;
  name: string;
  description: string;
}

const defaultCategories: AffiliateCategory[] = [
  { id: '1', name: 'Afiliados Iniciantes', description: 'Afiliados com menos de 3 meses de atividade' },
  { id: '2', name: 'Afiliados Intermediários', description: 'Afiliados com 3-12 meses de atividade' },
  { id: '3', name: 'Afiliados Avançados', description: 'Afiliados com mais de 12 meses de atividade' },
  { id: '4', name: 'Afiliados VIP', description: 'Afiliados com alto volume de indicações' },
];

const defaultReductionIntervals: ReductionInterval[] = [
  { id: '1', days: 35, reductionPercentage: 5 },
  { id: '2', days: 42, reductionPercentage: 10 },
  { id: '3', days: 49, reductionPercentage: 20 },
  { id: '4', days: 56, reductionPercentage: 35 },
  { id: '5', days: 63, reductionPercentage: 50 },
  { id: '6', days: 70, reductionPercentage: 75 },
  { id: '7', days: 77, reductionPercentage: 100 },
];

const InactivityRulesSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'categories'>('rules');
  const [inactivityRules, setInactivityRules] = useState<InactivityRule[]>([
    {
      id: '1',
      categoryName: 'Afiliados Iniciantes',
      inactivityThresholdDays: 28,
      reductionIntervals: defaultReductionIntervals,
      isActive: true,
    },
  ]);
  const [categories, setCategories] = useState<AffiliateCategory[]>(defaultCategories);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');

  const addNewRule = () => {
    const newRule: InactivityRule = {
      id: Date.now().toString(),
      categoryName: 'Nova Categoria',
      inactivityThresholdDays: 28,
      reductionIntervals: [...defaultReductionIntervals],
      isActive: true,
    };
    setInactivityRules([...inactivityRules, newRule]);
    setEditingRule(newRule.id);
  };

  const updateRule = (ruleId: string, updates: Partial<InactivityRule>) => {
    setInactivityRules(rules =>
      rules.map(rule =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    );
  };

  const deleteRule = (ruleId: string) => {
    setInactivityRules(rules => rules.filter(rule => rule.id !== ruleId));
  };

  const addReductionInterval = (ruleId: string) => {
    const rule = inactivityRules.find(r => r.id === ruleId);
    if (!rule) return;

    const lastInterval = rule.reductionIntervals[rule.reductionIntervals.length - 1];
    const newInterval: ReductionInterval = {
      id: Date.now().toString(),
      days: lastInterval ? lastInterval.days + 7 : 35,
      reductionPercentage: lastInterval ? Math.min(lastInterval.reductionPercentage + 10, 100) : 5,
    };

    updateRule(ruleId, {
      reductionIntervals: [...rule.reductionIntervals, newInterval],
    });
  };

  const updateReductionInterval = (ruleId: string, intervalId: string, updates: Partial<ReductionInterval>) => {
    const rule = inactivityRules.find(r => r.id === ruleId);
    if (!rule) return;

    const updatedIntervals = rule.reductionIntervals.map(interval =>
      interval.id === intervalId ? { ...interval, ...updates } : interval
    );

    updateRule(ruleId, { reductionIntervals: updatedIntervals });
  };

  const deleteReductionInterval = (ruleId: string, intervalId: string) => {
    const rule = inactivityRules.find(r => r.id === ruleId);
    if (!rule) return;

    const updatedIntervals = rule.reductionIntervals.filter(interval => interval.id !== intervalId);
    updateRule(ruleId, { reductionIntervals: updatedIntervals });
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: AffiliateCategory = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim(),
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setNewCategoryDescription('');
  };

  const updateCategory = (categoryId: string, updates: Partial<AffiliateCategory>) => {
    setCategories(cats =>
      cats.map(cat =>
        cat.id === categoryId ? { ...cat, ...updates } : cat
      )
    );
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(cats => cats.filter(cat => cat.id !== categoryId));
  };

  const handleSave = () => {
    console.log('Saving Inactivity Rules:', inactivityRules);
    console.log('Saving Categories:', categories);
    alert('Regras de Inatividade salvas com sucesso!');
  };

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[600px]">
      <h2 className="text-xl lg:text-2xl font-semibold text-branco mb-6 font-sora">
        Configurar Regras de Inatividade de Afiliados
      </h2>

      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-600">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'rules'
              ? 'text-azul-ciano border-b-2 border-azul-ciano'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Regras de Inatividade
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'categories'
              ? 'text-azul-ciano border-b-2 border-azul-ciano'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Categorias de Afiliados
        </button>
      </div>

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              Configure regras detalhadas de inatividade para diferentes categorias de afiliados.
              Defina períodos de inatividade e reduções progressivas de comissões.
            </p>
            <button
              onClick={addNewRule}
              className="flex items-center gap-2 px-4 py-2 bg-azul-ciano text-branco rounded-md hover:bg-opacity-80"
            >
              <Plus size={16} />
              Nova Regra
            </button>
          </div>

          {inactivityRules.map((rule) => (
            <div key={rule.id} className="bg-cinza-escuro rounded-lg p-6 shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  {editingRule === rule.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Nome da Categoria
                        </label>
                        <select
                          value={rule.categoryName}
                          onChange={(e) => updateRule(rule.id, { categoryName: e.target.value })}
                          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-white"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Dias para considerar inativo
                        </label>
                        <input
                          type="number"
                          value={rule.inactivityThresholdDays}
                          onChange={(e) => updateRule(rule.id, { inactivityThresholdDays: parseInt(e.target.value) || 0 })}
                          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-white"
                          placeholder="Ex: 28"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold text-azul-ciano">{rule.categoryName}</h3>
                      <p className="text-sm text-gray-400">
                        Inativo após {rule.inactivityThresholdDays} dias sem atividade
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={rule.isActive}
                      onChange={(e) => updateRule(rule.id, { isActive: e.target.checked })}
                      className="rounded"
                    />
                    Ativa
                  </label>
                  {editingRule === rule.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingRule(null)}
                        className="p-2 text-green-400 hover:text-green-300"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditingRule(null)}
                        className="p-2 text-gray-400 hover:text-gray-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingRule(rule.id)}
                        className="p-2 text-azul-ciano hover:text-blue-300"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Reduction Intervals */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-300">Intervalos de Redução</h4>
                  <button
                    onClick={() => addReductionInterval(rule.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-500"
                  >
                    <Plus size={14} />
                    Adicionar Intervalo
                  </button>
                </div>

                <div className="grid gap-3">
                  {rule.reductionIntervals
                    .sort((a, b) => a.days - b.days)
                    .map((interval) => (
                      <div key={interval.id} className="flex items-center gap-4 p-3 bg-gray-700 rounded">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Dias</label>
                            <input
                              type="number"
                              value={interval.days}
                              onChange={(e) => updateReductionInterval(rule.id, interval.id, { days: parseInt(e.target.value) || 0 })}
                              className="w-full p-2 text-sm rounded bg-gray-600 border border-gray-500 focus:border-azul-ciano outline-none text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Redução (%)</label>
                            <input
                              type="number"
                              value={interval.reductionPercentage}
                              onChange={(e) => updateReductionInterval(rule.id, interval.id, { reductionPercentage: parseInt(e.target.value) || 0 })}
                              className="w-full p-2 text-sm rounded bg-gray-600 border border-gray-500 focus:border-azul-ciano outline-none text-white"
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => deleteReductionInterval(rule.id, interval.id)}
                          className="p-2 text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                </div>

                {rule.reductionIntervals.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-800 rounded">
                    <h5 className="text-sm font-medium text-gray-300 mb-2">Resumo da Regra:</h5>
                    <p className="text-xs text-gray-400">
                      Após {rule.inactivityThresholdDays} dias, o afiliado fica inativo. 
                      As reduções de comissão serão aplicadas progressivamente:
                    </p>
                    <ul className="text-xs text-gray-400 mt-2 space-y-1">
                      {rule.reductionIntervals
                        .sort((a, b) => a.days - b.days)
                        .map((interval) => (
                          <li key={interval.id}>
                            • {interval.days} dias: redução de {interval.reductionPercentage}%
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-cinza-escuro rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold text-azul-ciano mb-4">Adicionar Nova Categoria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nome da Categoria</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-white"
                  placeholder="Ex: Afiliados Premium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
                <input
                  type="text"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-white"
                  placeholder="Descrição da categoria"
                />
              </div>
            </div>
            <button
              onClick={addCategory}
              className="flex items-center gap-2 px-4 py-2 bg-azul-ciano text-branco rounded-md hover:bg-opacity-80"
            >
              <Plus size={16} />
              Adicionar Categoria
            </button>
          </div>

          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-cinza-escuro rounded-lg p-4 shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {editingCategory === category.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-white"
                        />
                        <input
                          type="text"
                          value={category.description}
                          onChange={(e) => updateCategory(category.id, { description: e.target.value })}
                          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-white"
                        />
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-md font-semibold text-azul-ciano">{category.name}</h4>
                        <p className="text-sm text-gray-400">{category.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingCategory === category.id ? (
                      <>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="p-2 text-green-400 hover:text-green-300"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="p-2 text-gray-400 hover:text-gray-300"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingCategory(category.id)}
                          className="p-2 text-azul-ciano hover:text-blue-300"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="p-2 text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
        >
          Salvar Todas as Configurações
        </button>
      </div>
    </div>
  );
};

export default InactivityRulesSettings;

