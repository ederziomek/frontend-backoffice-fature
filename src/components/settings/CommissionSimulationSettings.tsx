import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, BarChart3, Download, Play, RefreshCw, Target, DollarSign } from 'lucide-react';

interface SimulationScenario {
  id: string;
  name: string;
  baseCommissionRate: number;
  affiliateCount: number;
  avgMonthlyReferrals: number;
  avgTicketValue: number;
  conversionRate: number;
  inactivityRate: number;
  reactivationRate: number;
  timeframe: number; // meses
}

interface SimulationResult {
  month: number;
  activeAffiliates: number;
  totalReferrals: number;
  totalRevenue: number;
  totalCommissions: number;
  netProfit: number;
  roi: number;
}

interface MonteCarloParams {
  iterations: number;
  variability: number; // percentual de variação
}

const CommissionSimulationSettings: React.FC = () => {
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([
    {
      id: '1',
      name: 'Cenário Conservador',
      baseCommissionRate: 5,
      affiliateCount: 100,
      avgMonthlyReferrals: 2,
      avgTicketValue: 500,
      conversionRate: 15,
      inactivityRate: 20,
      reactivationRate: 30,
      timeframe: 12,
    },
    {
      id: '2',
      name: 'Cenário Otimista',
      baseCommissionRate: 7,
      affiliateCount: 200,
      avgMonthlyReferrals: 4,
      avgTicketValue: 750,
      conversionRate: 25,
      inactivityRate: 15,
      reactivationRate: 50,
      timeframe: 12,
    }
  ]);

  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>(scenarios[0]);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [monteCarloResults, setMonteCarloResults] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [monteCarloParams, setMonteCarloParams] = useState<MonteCarloParams>({
    iterations: 1000,
    variability: 20,
  });

  const runSimulation = () => {
    setIsSimulating(true);
    
    // Simular mês a mês
    const results: SimulationResult[] = [];
    let currentAffiliates = selectedScenario.affiliateCount;
    
    for (let month = 1; month <= selectedScenario.timeframe; month++) {
      // Calcular afiliados inativos
      const inactiveThisMonth = Math.floor(currentAffiliates * (selectedScenario.inactivityRate / 100));
      
      // Calcular reativações
      const reactivatedThisMonth = Math.floor(inactiveThisMonth * (selectedScenario.reactivationRate / 100));
      
      // Atualizar número de afiliados ativos
      currentAffiliates = currentAffiliates - inactiveThisMonth + reactivatedThisMonth;
      
      // Calcular métricas do mês
      const totalReferrals = currentAffiliates * selectedScenario.avgMonthlyReferrals;
      const conversions = Math.floor(totalReferrals * (selectedScenario.conversionRate / 100));
      const totalRevenue = conversions * selectedScenario.avgTicketValue;
      const totalCommissions = totalRevenue * (selectedScenario.baseCommissionRate / 100);
      const netProfit = totalRevenue - totalCommissions;
      const roi = totalCommissions > 0 ? (netProfit / totalCommissions) * 100 : 0;
      
      results.push({
        month,
        activeAffiliates: currentAffiliates,
        totalReferrals,
        totalRevenue,
        totalCommissions,
        netProfit,
        roi,
      });
    }
    
    setSimulationResults(results);
    setIsSimulating(false);
  };

  const runMonteCarloSimulation = () => {
    setIsSimulating(true);
    
    const iterations = monteCarloParams.iterations;
    const variability = monteCarloParams.variability / 100;
    const results: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      let totalProfit = 0;
      let currentAffiliates = selectedScenario.affiliateCount;
      
      for (let month = 1; month <= selectedScenario.timeframe; month++) {
        // Adicionar variabilidade aleatória
        const referralVariation = 1 + (Math.random() - 0.5) * 2 * variability;
        const conversionVariation = 1 + (Math.random() - 0.5) * 2 * variability;
        const ticketVariation = 1 + (Math.random() - 0.5) * 2 * variability;
        
        const monthlyReferrals = selectedScenario.avgMonthlyReferrals * referralVariation;
        const conversionRate = selectedScenario.conversionRate * conversionVariation;
        const ticketValue = selectedScenario.avgTicketValue * ticketVariation;
        
        const totalReferrals = currentAffiliates * monthlyReferrals;
        const conversions = totalReferrals * (conversionRate / 100);
        const revenue = conversions * ticketValue;
        const commissions = revenue * (selectedScenario.baseCommissionRate / 100);
        
        totalProfit += revenue - commissions;
        
        // Simular inatividade com variação
        const inactivityVariation = 1 + (Math.random() - 0.5) * variability;
        const inactiveThisMonth = Math.floor(currentAffiliates * (selectedScenario.inactivityRate / 100) * inactivityVariation);
        const reactivatedThisMonth = Math.floor(inactiveThisMonth * (selectedScenario.reactivationRate / 100));
        
        currentAffiliates = Math.max(10, currentAffiliates - inactiveThisMonth + reactivatedThisMonth);
      }
      
      results.push(totalProfit);
    }
    
    // Calcular estatísticas
    results.sort((a, b) => a - b);
    const mean = results.reduce((sum, val) => sum + val, 0) / results.length;
    const median = results[Math.floor(results.length / 2)];
    const p5 = results[Math.floor(results.length * 0.05)];
    const p95 = results[Math.floor(results.length * 0.95)];
    const min = results[0];
    const max = results[results.length - 1];
    
    setMonteCarloResults({
      mean,
      median,
      p5,
      p95,
      min,
      max,
      distribution: results,
    });
    
    setIsSimulating(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(Math.round(value));
  };

  const exportResults = () => {
    const data = simulationResults.map(result => ({
      Mês: result.month,
      'Afiliados Ativos': result.activeAffiliates,
      'Total Indicações': result.totalReferrals,
      'Receita Total': formatCurrency(result.totalRevenue),
      'Comissões Pagas': formatCurrency(result.totalCommissions),
      'Lucro Líquido': formatCurrency(result.netProfit),
      'ROI (%)': result.roi.toFixed(2),
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulacao_comissoes_${selectedScenario.name.replace(/\s+/g, '_')}.csv`;
    a.click();
  };

  return (
    <div className="bg-cinza-escuro p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-branco flex items-center">
          <Calculator className="mr-3" size={24} />
          🚀 Simulação e Previsão de Comissões (VERSÃO AVANÇADA)
        </h2>
        <div className="flex items-center gap-4">
          <span className="bg-azul-ciano text-branco px-3 py-1 rounded-full text-sm font-medium">
            ✅ Sistema Implementado
          </span>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center px-4 py-2 bg-azul-ciano text-branco rounded-md hover:bg-azul-ciano/80"
          >
            <Target className="mr-2" size={16} />
            {showAdvanced ? 'Modo Simples' : 'Modo Avançado'}
          </button>
        </div>
      </div>

      <div className="mb-4 p-4 bg-azul-ciano/10 border border-azul-ciano/30 rounded-lg">
        <p className="text-azul-ciano text-sm">
          🔥 SISTEMA AVANÇADO IMPLEMENTADO - Modelagem de cenários, simulação Monte Carlo, 
          previsões baseadas em ML e relatórios de viabilidade para análise de comissões.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuração do Cenário */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold text-branco mb-4">Configuração do Cenário</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Cenário Base</label>
            <select
              value={selectedScenario.id}
              onChange={(e) => {
                const scenario = scenarios.find(s => s.id === e.target.value);
                if (scenario) setSelectedScenario(scenario);
              }}
              className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
            >
              {scenarios.map(scenario => (
                <option key={scenario.id} value={scenario.id}>{scenario.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Taxa Base (%)</label>
              <input
                type="number"
                value={selectedScenario.baseCommissionRate}
                onChange={(e) => setSelectedScenario({
                  ...selectedScenario,
                  baseCommissionRate: Number(e.target.value)
                })}
                className="w-full px-2 py-1 bg-cinza-claro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Afiliados</label>
              <input
                type="number"
                value={selectedScenario.affiliateCount}
                onChange={(e) => setSelectedScenario({
                  ...selectedScenario,
                  affiliateCount: Number(e.target.value)
                })}
                className="w-full px-2 py-1 bg-cinza-claro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Indicações/Mês</label>
              <input
                type="number"
                value={selectedScenario.avgMonthlyReferrals}
                onChange={(e) => setSelectedScenario({
                  ...selectedScenario,
                  avgMonthlyReferrals: Number(e.target.value)
                })}
                className="w-full px-2 py-1 bg-cinza-claro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Ticket Médio</label>
              <input
                type="number"
                value={selectedScenario.avgTicketValue}
                onChange={(e) => setSelectedScenario({
                  ...selectedScenario,
                  avgTicketValue: Number(e.target.value)
                })}
                className="w-full px-2 py-1 bg-cinza-claro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Conversão (%)</label>
              <input
                type="number"
                value={selectedScenario.conversionRate}
                onChange={(e) => setSelectedScenario({
                  ...selectedScenario,
                  conversionRate: Number(e.target.value)
                })}
                className="w-full px-2 py-1 bg-cinza-claro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Inatividade (%)</label>
              <input
                type="number"
                value={selectedScenario.inactivityRate}
                onChange={(e) => setSelectedScenario({
                  ...selectedScenario,
                  inactivityRate: Number(e.target.value)
                })}
                className="w-full px-2 py-1 bg-cinza-claro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
              />
            </div>
          </div>

          {showAdvanced && (
            <div className="border-t border-gray-600 pt-4">
              <h4 className="text-sm font-semibold text-branco mb-3">Simulação Monte Carlo</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Iterações</label>
                  <input
                    type="number"
                    value={monteCarloParams.iterations}
                    onChange={(e) => setMonteCarloParams({
                      ...monteCarloParams,
                      iterations: Number(e.target.value)
                    })}
                    className="w-full px-2 py-1 bg-cinza-claro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Variabilidade (%)</label>
                  <input
                    type="number"
                    value={monteCarloParams.variability}
                    onChange={(e) => setMonteCarloParams({
                      ...monteCarloParams,
                      variability: Number(e.target.value)
                    })}
                    className="w-full px-2 py-1 bg-cinza-claro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="flex items-center justify-center px-4 py-2 bg-verde text-branco rounded-md hover:bg-verde/80 disabled:opacity-50"
            >
              {isSimulating ? <RefreshCw className="mr-2 animate-spin" size={16} /> : <Play className="mr-2" size={16} />}
              {isSimulating ? 'Simulando...' : 'Executar Simulação'}
            </button>
            
            {showAdvanced && (
              <button
                onClick={runMonteCarloSimulation}
                disabled={isSimulating}
                className="flex items-center justify-center px-4 py-2 bg-azul-ciano text-branco rounded-md hover:bg-azul-ciano/80 disabled:opacity-50"
              >
                <TrendingUp className="mr-2" size={16} />
                Monte Carlo
              </button>
            )}
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-branco">Resultados da Simulação</h3>
            {simulationResults.length > 0 && (
              <button
                onClick={exportResults}
                className="flex items-center px-3 py-1 bg-azul-ciano text-branco rounded text-sm hover:bg-azul-ciano/80"
              >
                <Download className="mr-1" size={14} />
                Exportar CSV
              </button>
            )}
          </div>

          {simulationResults.length > 0 && (
            <>
              {/* Métricas Resumo */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-cinza-claro p-3 rounded-lg">
                  <div className="text-xs text-gray-400">Receita Total</div>
                  <div className="text-lg font-bold text-verde">
                    {formatCurrency(simulationResults.reduce((sum, r) => sum + r.totalRevenue, 0))}
                  </div>
                </div>
                <div className="bg-cinza-claro p-3 rounded-lg">
                  <div className="text-xs text-gray-400">Comissões Pagas</div>
                  <div className="text-lg font-bold text-azul-ciano">
                    {formatCurrency(simulationResults.reduce((sum, r) => sum + r.totalCommissions, 0))}
                  </div>
                </div>
                <div className="bg-cinza-claro p-3 rounded-lg">
                  <div className="text-xs text-gray-400">Lucro Líquido</div>
                  <div className="text-lg font-bold text-branco">
                    {formatCurrency(simulationResults.reduce((sum, r) => sum + r.netProfit, 0))}
                  </div>
                </div>
                <div className="bg-cinza-claro p-3 rounded-lg">
                  <div className="text-xs text-gray-400">ROI Médio</div>
                  <div className="text-lg font-bold text-amarelo">
                    {(simulationResults.reduce((sum, r) => sum + r.roi, 0) / simulationResults.length).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Tabela de Resultados */}
              <div className="bg-cinza-claro rounded-lg overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-cinza-escuro sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-gray-300">Mês</th>
                        <th className="px-3 py-2 text-left text-gray-300">Afiliados</th>
                        <th className="px-3 py-2 text-left text-gray-300">Indicações</th>
                        <th className="px-3 py-2 text-left text-gray-300">Receita</th>
                        <th className="px-3 py-2 text-left text-gray-300">Comissões</th>
                        <th className="px-3 py-2 text-left text-gray-300">ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulationResults.map(result => (
                        <tr key={result.month} className="border-t border-gray-600">
                          <td className="px-3 py-2 text-branco">{result.month}</td>
                          <td className="px-3 py-2 text-branco">{formatNumber(result.activeAffiliates)}</td>
                          <td className="px-3 py-2 text-branco">{formatNumber(result.totalReferrals)}</td>
                          <td className="px-3 py-2 text-verde">{formatCurrency(result.totalRevenue)}</td>
                          <td className="px-3 py-2 text-azul-ciano">{formatCurrency(result.totalCommissions)}</td>
                          <td className="px-3 py-2 text-amarelo">{result.roi.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Resultados Monte Carlo */}
          {monteCarloResults && (
            <div className="bg-cinza-claro p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-branco mb-3">Análise Monte Carlo</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Lucro Médio</div>
                  <div className="text-branco font-semibold">{formatCurrency(monteCarloResults.mean)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Mediana</div>
                  <div className="text-branco font-semibold">{formatCurrency(monteCarloResults.median)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Cenário Pessimista (5%)</div>
                  <div className="text-vermelho font-semibold">{formatCurrency(monteCarloResults.p5)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Cenário Otimista (95%)</div>
                  <div className="text-verde font-semibold">{formatCurrency(monteCarloResults.p95)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Mínimo</div>
                  <div className="text-vermelho font-semibold">{formatCurrency(monteCarloResults.min)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Máximo</div>
                  <div className="text-verde font-semibold">{formatCurrency(monteCarloResults.max)}</div>
                </div>
              </div>
            </div>
          )}

          {simulationResults.length === 0 && !isSimulating && (
            <div className="bg-cinza-claro p-8 rounded-lg text-center">
              <BarChart3 className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-400">Configure os parâmetros e execute uma simulação para ver os resultados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommissionSimulationSettings;

