import React, { useState } from 'react';
import { DollarSign, TrendingUp, Award, Settings, Save, RotateCcw, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface RevenueShareSettingsData {
  // Distribuição do Revenue Share
  cofrePercentage: number | string; // % que vai para o cofre de comissões
  rankingsPercentage: number | string; // % que vai para os rankings
  
  // Configurações de Abatimento
  abatimentoIndicacaoDiaria: boolean; // Se indicação diária é abatida do Revenue Share
  abatimentoBaus: boolean; // Se baús são abatidos do Revenue Share
  abatimentoLevelUp: boolean; // Se recompensas de subir de level são abatidas do Revenue Share
  retencaoPercentage: number | string; // % de retenção abatido do GGR total
  taxaAdministrativa: number | string; // Taxa administrativa de 20% conforme documento
  
  // Configurações de Pagamento
  pagamentoPeloCofre: boolean; // Se todas as recompensas são pagas através do cofre
  
  // Configurações Avançadas
  limiteMinimoRevShare: number | string; // Valor mínimo de Revenue Share para processar
  frequenciaPagamento: 'diario' | 'semanal' | 'mensal'; // Frequência de pagamento das recompensas
}

const initialSettings: RevenueShareSettingsData = {
  cofrePercentage: 96, // 96% conforme documento padrão
  rankingsPercentage: 4, // 4% conforme documento padrão
  abatimentoIndicacaoDiaria: true,
  abatimentoBaus: true,
  abatimentoLevelUp: true,
  retencaoPercentage: 5,
  taxaAdministrativa: 20, // Taxa administrativa de 20% conforme documento
  pagamentoPeloCofre: true,
  limiteMinimoRevShare: 1,
  frequenciaPagamento: 'diario',
};

const RevenueShareSettings: React.FC = () => {
  const [settings, setSettings] = useState<RevenueShareSettingsData>(initialSettings);
  const [activeTab, setActiveTab] = useState<'distribuicao' | 'abatimento' | 'pagamento' | 'avancado'>('distribuicao');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleChange = (field: keyof RevenueShareSettingsData, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    
    // Validação em tempo real para percentuais
    if (field === 'cofrePercentage' || field === 'rankingsPercentage') {
      const newSettings = { ...settings, [field]: value };
      const total = Number(newSettings.cofrePercentage) + Number(newSettings.rankingsPercentage);
      
      if (total !== 100) {
        setValidationErrors(['A soma dos percentuais do cofre e rankings deve ser exatamente 100%']);
      } else {
        setValidationErrors([]);
      }
    }
  };

  const handleSave = () => {
    const errors: string[] = [];
    
    // Validações
    const total = Number(settings.cofrePercentage) + Number(settings.rankingsPercentage);
    if (total !== 100) {
      errors.push('A soma dos percentuais do cofre e rankings deve ser exatamente 100%');
    }
    
    if (Number(settings.cofrePercentage) < 0 || Number(settings.cofrePercentage) > 100) {
      errors.push('Percentual do cofre deve estar entre 0% e 100%');
    }
    
    if (Number(settings.rankingsPercentage) < 0 || Number(settings.rankingsPercentage) > 100) {
      errors.push('Percentual dos rankings deve estar entre 0% e 100%');
    }

    if (Number(settings.taxaAdministrativa) < 0 || Number(settings.taxaAdministrativa) > 100) {
      errors.push('Taxa administrativa deve estar entre 0% e 100%');
    }
    
    if (Number(settings.limiteMinimoRevShare) < 0) {
      errors.push('Limite mínimo de Revenue Share deve ser maior ou igual a 0');
    }
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors([]);
    console.log('Saving Revenue Share Settings (mock):', settings);
    alert('Configurações de Revenue Share salvas com sucesso!');
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setValidationErrors([]);
  };

  const tabs = [
    { id: 'distribuicao', label: 'Distribuição', icon: DollarSign },
    { id: 'abatimento', label: 'Abatimentos', icon: Award },
    { id: 'pagamento', label: 'Pagamento', icon: TrendingUp },
    { id: 'avancado', label: 'Avançado', icon: Settings },
  ] as const;

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[400px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold text-branco mb-2 font-sora flex items-center">
            <DollarSign size={24} className="mr-3 text-azul-ciano" />
            Configurações de Revenue Share
          </h2>
          <p className="text-sm text-gray-400">
            Configure como o Revenue Share é distribuído e como as recompensas são processadas
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            onClick={handleReset}
            className="flex items-center px-3 py-2 text-sm text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
          >
            <RotateCcw size={16} className="mr-2" />
            Resetar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
          >
            <Save size={16} className="mr-2" />
            Salvar
          </button>
        </div>
      </div>

      {/* Validação de Erros */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-md">
          <div className="flex items-center mb-2">
            <AlertCircle size={16} className="text-red-400 mr-2" />
            <span className="text-sm font-semibold text-red-400">Erros de Validação:</span>
          </div>
          <ul className="text-sm text-red-300 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 bg-cinza-escuro p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-azul-ciano text-branco font-semibold'
                : 'text-gray-300 hover:text-branco hover:bg-gray-700'
            }`}
          >
            <tab.icon size={16} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      <div className="bg-cinza-escuro rounded-lg p-4 md:p-6">
        {activeTab === 'distribuicao' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-azul-ciano mb-4">Distribuição do Revenue Share</h3>
              <p className="text-sm text-gray-400 mb-6">
                Configure como o Revenue Share total será dividido entre o cofre de comissões e os rankings competitivos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium text-gray-300 mb-2">
                    Percentual para Cofre de Comissões (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.cofrePercentage}
                    onChange={(e) => handleChange('cofrePercentage', e.target.value)}
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-lg"
                    placeholder="96"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Valor que será destinado ao cofre para distribuição aos afiliados
                  </p>
                </div>
                
                <div>
                  <label className="block font-medium text-gray-300 mb-2">
                    Percentual para Rankings (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.rankingsPercentage}
                    onChange={(e) => handleChange('rankingsPercentage', e.target.value)}
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none text-lg"
                    placeholder="4"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Valor que será usado para financiar premiações dos rankings
                  </p>
                </div>
              </div>
              
              {/* Visualização da Distribuição */}
              <div className="mt-6 p-4 bg-gray-800/50 rounded-md border border-gray-700">
                <h4 className="text-sm font-semibold text-azul-ciano mb-3">Visualização da Distribuição</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Cofre de Comissões:</span>
                    <span className="text-sm font-semibold text-green-400">{settings.cofrePercentage}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Rankings:</span>
                    <span className="text-sm font-semibold text-blue-400">{settings.rankingsPercentage}%</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-300">Total:</span>
                      <span className={`text-sm font-bold ${
                        Number(settings.cofrePercentage) + Number(settings.rankingsPercentage) === 100 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {Number(settings.cofrePercentage) + Number(settings.rankingsPercentage)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'abatimento' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-azul-ciano mb-4">Configurações de Abatimento</h3>
              <p className="text-sm text-gray-400 mb-6">
                Configure quais recompensas serão abatidas do Revenue Share antes da distribuição.
              </p>
              
              <div className="space-y-4">
                {/* Taxa Administrativa - NOVO CAMPO */}
                <div className="p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-md">
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-yellow-400">Taxa Administrativa</h4>
                    <p className="text-xs text-yellow-300">Taxa administrativa fixa abatida do GGR antes do cálculo do NGR</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Taxa Administrativa (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={settings.taxaAdministrativa}
                        onChange={(e) => handleChange('taxaAdministrativa', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        placeholder="20.0"
                      />
                    </div>
                    <div className="text-xs text-yellow-300 mt-6">
                      Percentual fixo sobre o GGR total
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-md border border-gray-700">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300">Indicação Diária</h4>
                    <p className="text-xs text-gray-500">Abater valores de indicação diária do Revenue Share</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.abatimentoIndicacaoDiaria}
                      onChange={(e) => handleChange('abatimentoIndicacaoDiaria', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-azul-ciano"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-md border border-gray-700">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300">Baús de Recompensa</h4>
                    <p className="text-xs text-gray-500">Abater valores dos baús do Revenue Share</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.abatimentoBaus}
                      onChange={(e) => handleChange('abatimentoBaus', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-azul-ciano"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-md border border-gray-700">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300">Subir de Level</h4>
                    <p className="text-xs text-gray-500">Abater recompensas de mudança de level do Revenue Share</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.abatimentoLevelUp}
                      onChange={(e) => handleChange('abatimentoLevelUp', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-azul-ciano"></div>
                  </label>
                </div>
                
                <div className="p-4 bg-gray-800/50 rounded-md border border-gray-700">
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-300">Retenção</h4>
                    <p className="text-xs text-gray-500">Percentual abatido do GGR total para custos de reativação de clientes</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Percentual de Retenção (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={settings.retencaoPercentage}
                        onChange={(e) => handleChange('retencaoPercentage', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-azul-ciano focus:border-transparent"
                        placeholder="5.0"
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-6">
                      Abatido do GGR antes do cálculo do Revenue Share
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/50 rounded-md">
                <div className="flex items-center mb-2">
                  <Info size={16} className="text-blue-400 mr-2" />
                  <span className="text-sm font-semibold text-blue-400">Ordem de Cálculo do NGR</span>
                </div>
                <div className="text-sm text-blue-300 space-y-1">
                  <p>1. <strong>GGR Total</strong> - Receita bruta de jogos</p>
                  <p>2. <strong>- Taxa Administrativa ({settings.taxaAdministrativa}%)</strong> - Custos operacionais fixos</p>
                  <p>3. <strong>- Indicações Diárias</strong> - Valor real gasto (se ativo)</p>
                  <p>4. <strong>- Baús Semanais</strong> - Valor real gasto (se ativo)</p>
                  <p>5. <strong>- Level Up Bonuses</strong> - Valor real gasto (se ativo)</p>
                  <p>6. <strong>- Retenção ({settings.retencaoPercentage}%)</strong> - Custos de reativação</p>
                  <p>7. <strong>= NGR Final</strong> - Base para distribuição Revenue Share</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pagamento' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-azul-ciano mb-4">Configurações de Pagamento</h3>
              <p className="text-sm text-gray-400 mb-6">
                Configure como as recompensas são processadas e pagas aos afiliados.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-md border border-gray-700">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300">Pagamento pelo Cofre</h4>
                    <p className="text-xs text-gray-500">Todas as recompensas são processadas através do cofre de comissões</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.pagamentoPeloCofre}
                      onChange={(e) => handleChange('pagamentoPeloCofre', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-azul-ciano"></div>
                  </label>
                </div>
                
                <div className="p-4 bg-gray-800/50 rounded-md border border-gray-700">
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-300">Frequência de Pagamento</h4>
                    <p className="text-xs text-gray-500">Com que frequência as recompensas são processadas</p>
                  </div>
                  <select
                    value={settings.frequenciaPagamento}
                    onChange={(e) => handleChange('frequenciaPagamento', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-azul-ciano focus:border-transparent"
                  >
                    <option value="diario">Diário</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensal">Mensal</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'avancado' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-azul-ciano mb-4">Configurações Avançadas</h3>
              <p className="text-sm text-gray-400 mb-6">
                Configurações técnicas para otimização do sistema de Revenue Share.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-md border border-gray-700">
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-300">Limite Mínimo de Revenue Share</h4>
                    <p className="text-xs text-gray-500">Valor mínimo de Revenue Share necessário para processar distribuição</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Valor Mínimo (R$)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={settings.limiteMinimoRevShare}
                        onChange={(e) => handleChange('limiteMinimoRevShare', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-azul-ciano focus:border-transparent"
                        placeholder="1.00"
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-6">
                      Evita processamento de valores muito baixos
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueShareSettings;

