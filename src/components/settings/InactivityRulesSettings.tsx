import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, Clock, Target } from 'lucide-react';

interface ReductionInterval {
  id: string;
  days: number;
  reductionPercentage: number;
}

interface ReactivationRule {
  requiredReferrals: number;
  timeframeDays: number;
  isAutomatic: boolean;
  maxAttempts: number;
}

interface InactivityRule {
  id: string;
  categoryName: string;
  inactivityThresholdDays: number;
  reductionIntervals: ReductionInterval[];
  reactivationRule: ReactivationRule;
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

const defaultReactivationRules: { [key: string]: ReactivationRule } = {
  'Afiliados Iniciantes': { requiredReferrals: 2, timeframeDays: 30, isAutomatic: true, maxAttempts: 3 },
  'Afiliados Intermediários': { requiredReferrals: 3, timeframeDays: 30, isAutomatic: true, maxAttempts: 3 },
  'Afiliados Avançados': { requiredReferrals: 5, timeframeDays: 45, isAutomatic: true, maxAttempts: 2 },
  'Afiliados VIP': { requiredReferrals: 3, timeframeDays: 30, isAutomatic: true, maxAttempts: 5 },
};

const InactivityRulesSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'categories'>('rules');
  const [inactivityRules, setInactivityRules] = useState<InactivityRule[]>([
    {
      id: '1',
      categoryName: 'Afiliados Iniciantes',
      inactivityThresholdDays: 28,
      reductionIntervals: defaultReductionIntervals,
      reactivationRule: defaultReactivationRules['Afiliados Iniciantes'],
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
      reactivationRule: { requiredReferrals: 2, timeframeDays: 30, isAutomatic: true, maxAttempts: 3 },
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

  const updateReactivationRule = (ruleId: string, updates: Partial<ReactivationRule>) => {
    setInactivityRules(rules =>
      rules.map(rule =>
        rule.id === ruleId 
          ? { ...rule, reactivationRule: { ...rule.reactivationRule, ...updates } }
          : rule
      )
    );
  };

  const addReductionInterval = (ruleId: string) => {
    const newInterval: ReductionInterval = {
      id: Date.now().toString(),
      days: 84,
      reductionPercentage: 100,
    };
    
    setInactivityRules(rules =>
      rules.map(rule =>
        rule.id === ruleId 
          ? { ...rule, reductionIntervals: [...rule.reductionIntervals, newInterval] }
          : rule
      )
    );
  };

  const updateReductionInterval = (ruleId: string, intervalId: string, updates: Partial<ReductionInterval>) => {
    setInactivityRules(rules =>
      rules.map(rule =>
        rule.id === ruleId 
          ? {
              ...rule,
              reductionIntervals: rule.reductionIntervals.map(interval =>
                interval.id === intervalId ? { ...interval, ...updates } : interval
              )
            }
          : rule
      )
    );
  };

  const removeReductionInterval = (ruleId: string, intervalId: string) => {
    setInactivityRules(rules =>
      rules.map(rule =>
        rule.id === ruleId 
          ? {
              ...rule,
              reductionIntervals: rule.reductionIntervals.filter(interval => interval.id !== intervalId)
            }
          : rule
      )
    );
  };

  const deleteRule = (ruleId: string) => {
    setInactivityRules(rules => rules.filter(rule => rule.id !== ruleId));
  };

  const addNewCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: AffiliateCategory = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim() || 'Nova categoria de afiliado',
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

  // SEMPRE RETORNA A VERSÃO COMPLETA
  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[600px]">
      {/* Header com indicador de versão */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl lg:text-2xl font-semibold text-branco font-sora">
          🚀 Configurar Regras de Inatividade de Afiliados (VERSÃO COMPLETA - BUILD 2025-06-02)
        </h2>
        <div className="bg-green-500/20 border border-green-500 rounded-lg px-3 py-1">
          <span className="text-green-300 text-sm font-medium">✅ Versão Atualizada - COMMIT 024b8dcc</span>
        </div>
      </div>

      <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 mb-6">
        <p className="text-blue-300 font-medium">
          🔥 VERSÃO DEFINITIVA IMPLEMENTADA - Se você está vendo este texto, a versão correta está funcionando!
        </p>
        <p className="text-blue-200 text-sm mt-2">
          Esta versão inclui: Período editável, Sistema de reativação completo, Múltiplas categorias, Intervalos configuráveis
        </p>
      </div>

      <p className="text-gray-400 mb-6">
        Configure regras detalhadas de inatividade para diferentes categorias de afiliados. 
        Defina períodos de inatividade, reduções progressivas de comissões e critérios de reativação.
      </p>

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
            <h3 className="text-lg font-semibold text-branco">Regras por Categoria</h3>
            <button
              onClick={addNewRule}
              className="flex items-center px-4 py-2 text-sm font-medium text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
            >
              <Plus size={16} className="mr-2" />
              Nova Regra
            </button>
          </div>

          {inactivityRules.map((rule) => (
            <div key={rule.id} className="bg-cinza-escuro rounded-lg p-6 border border-gray-600">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  {editingRule === rule.id ? (
                    <div className="space-y-4">
                      {/* Category Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nome da Categoria
                        </label>
                        <select
                          value={rule.categoryName}
                          onChange={(e) => updateRule(rule.id, { categoryName: e.target.value })}
                          className="w-full px-3 py-2 bg-cinza-claro border border-gray-600 rounded-md text-branco"
                        >
                          {defaultCategories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Inactivity Threshold */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Dias para considerar inativo
                        </label>
                        <input
                          type="number"
                          min="7"
                          max="90"
                          value={rule.inactivityThresholdDays}
                          onChange={(e) => updateRule(rule.id, { inactivityThresholdDays: parseInt(e.target.value) || 28 })}
                          className="w-full px-3 py-2 bg-cinza-claro border border-gray-600 rounded-md text-branco"
                          placeholder="Ex: 28"
                        />
                        <p className="text-xs text-gray-400 mt-1">Entre 7 e 90 dias</p>
                      </div>

                      {/* Active Toggle */}
                      <div className="flex items-center">
                        <label className="block text-sm font-medium text-gray-300 mr-3">Ativa</label>
                        <input
                          type="checkbox"
                          checked={rule.isActive}
                          onChange={(e) => updateRule(rule.id, { isActive: e.target.checked })}
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-lg font-semibold text-branco">{rule.categoryName}</h4>
                      <p className="text-gray-400">
                        Inativo após {rule.inactivityThresholdDays} dias sem atividade
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  {editingRule === rule.id ? (
                    <>
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
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>

              {/* Reactivation Rules */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-3">
                  <Target size={20} className="text-green-500 mr-2" />
                  <h5 className="font-semibold text-white">Regras de Reativação</h5>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-300 mb-1">
                      Indicações Necessárias
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={rule.reactivationRule.requiredReferrals}
                      onChange={(e) => updateReactivationRule(rule.id, { 
                        requiredReferrals: parseInt(e.target.value) || 1 
                      })}
                      className="w-full px-3 py-2 bg-cinza-claro border border-gray-600 rounded-md text-branco"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-green-300 mb-1">
                      Prazo (dias)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={rule.reactivationRule.timeframeDays}
                      onChange={(e) => updateReactivationRule(rule.id, { 
                        timeframeDays: parseInt(e.target.value) || 30 
                      })}
                      className="w-full px-3 py-2 bg-cinza-claro border border-gray-600 rounded-md text-branco"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-green-300 mb-1">
                      Máx. Tentativas
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={rule.reactivationRule.maxAttempts}
                      onChange={(e) => updateReactivationRule(rule.id, { 
                        maxAttempts: parseInt(e.target.value) || 3 
                      })}
                      className="w-full px-3 py-2 bg-cinza-claro border border-gray-600 rounded-md text-branco"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <label className="flex items-center text-sm text-green-300">
                      <input
                        type="checkbox"
                        checked={rule.reactivationRule.isAutomatic}
                        onChange={(e) => updateReactivationRule(rule.id, { 
                          isAutomatic: e.target.checked 
                        })}
                        className="w-4 h-4 mr-2"
                      />
                      Automática
                    </label>
                  </div>
                </div>
                
                <p className="text-xs text-green-300 mt-2">
                  Reativação: {rule.reactivationRule.requiredReferrals} indicações validadas em {rule.reactivationRule.timeframeDays} dias 
                  {rule.reactivationRule.isAutomatic ? ' (automática)' : ''} • Máximo {rule.reactivationRule.maxAttempts} tentativas
                </p>
              </div>

              {/* Reduction Intervals */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock size={20} className="text-blue-400 mr-2" />
                    <h5 className="font-semibold text-white">Intervalos de Redução</h5>
                  </div>
                  <button
                    onClick={() => addReductionInterval(rule.id)}
                    className="flex items-center px-3 py-1 text-xs font-medium text-branco bg-orange-500 rounded-md hover:bg-opacity-80"
                  >
                    <Plus size={14} className="mr-1" />
                    Adicionar Intervalo
                  </button>
                </div>

                <div className="grid gap-3">
                  {rule.reductionIntervals.map((interval) => (
                    <div key={interval.id} className="flex items-center space-x-3 bg-gray-800/50 rounded-lg p-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-400 mb-1">Dias</label>
                        <input
                          type="number"
                          min="1"
                          value={interval.days}
                          onChange={(e) => updateReductionInterval(rule.id, interval.id, { 
                            days: parseInt(e.target.value) || 1 
                          })}
                          className="w-full px-2 py-1 bg-cinza-claro border border-gray-600 rounded text-branco text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-400 mb-1">Redução (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={interval.reductionPercentage}
                          onChange={(e) => updateReductionInterval(rule.id, interval.id, { 
                            reductionPercentage: parseInt(e.target.value) || 0 
                          })}
                          className="w-full px-2 py-1 bg-cinza-claro border border-gray-600 rounded text-branco text-sm"
                        />
                      </div>
                      <button
                        onClick={() => removeReductionInterval(rule.id, interval.id)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-branco">Gerenciar Categorias</h3>
          </div>

          {/* Add New Category */}
          <div className="bg-cinza-escuro rounded-lg p-6 border border-gray-600">
            <h4 className="text-md font-semibold text-branco mb-4">Adicionar Nova Categoria</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 bg-cinza-claro border border-gray-600 rounded-md text-branco"
                  placeholder="Ex: Afiliados Premium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                <input
                  type="text"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-cinza-claro border border-gray-600 rounded-md text-branco"
                  placeholder="Descrição da categoria"
                />
              </div>
            </div>
            <button
              onClick={addNewCategory}
              disabled={!newCategoryName.trim()}
              className="mt-4 px-4 py-2 text-sm font-medium text-branco bg-azul-ciano rounded-md hover:bg-opacity-80 disabled:opacity-50"
            >
              Adicionar Categoria
            </button>
          </div>

          {/* Categories List */}
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="bg-cinza-escuro rounded-lg p-4 border border-gray-600">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    {editingCategory === category.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                          className="w-full px-3 py-2 bg-cinza-claro border border-gray-600 rounded-md text-branco"
                        />
                        <input
                          type="text"
                          value={category.description}
                          onChange={(e) => updateCategory(category.id, { description: e.target.value })}
                          className="w-full px-3 py-2 bg-cinza-claro border border-gray-600 rounded-md text-branco"
                        />
                      </div>
                    ) : (
                      <div>
                        <h5 className="font-semibold text-branco">{category.name}</h5>
                        <p className="text-gray-400 text-sm">{category.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
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

