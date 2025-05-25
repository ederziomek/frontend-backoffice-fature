import React, { useState } from 'react';

interface RankingReward {
  position: number;
  rewardValue: number | string;
}

interface RankingConfig {
  id: string;
  name: string;
  period: 'semanal' | 'mensal' | 'quinzenal';
  criteria: string[]; // e.g., ['Número de indicações diretas válidas', 'GGR total da rede']
  tieBreaker: string;
  rewards: RankingReward[];
}

const initialRankingConfig: RankingConfig = {
  id: 'rankingExemplo1',
  name: 'Top Indicadores Semanal',
  period: 'semanal',
  criteria: ['Número de indicações diretas válidas'],
  tieBreaker: 'Data de cadastro mais antiga',
  rewards: [
    { position: 1, rewardValue: '' },
    { position: 2, rewardValue: '' },
    { position: 3, rewardValue: '' },
    // User requested fixed set, e.g., Top 3 or Top 5. Let's use Top 3 for mock.
  ],
};

// Mock data for ranking visualization
const mockRankingData = [
  { position: 1, affiliateName: 'Afiliado Campeão', score: 150, reward: 'R$ 500,00 (Mock)' },
  { position: 2, affiliateName: 'Vice Afiliado', score: 120, reward: 'R$ 300,00 (Mock)' },
  { position: 3, affiliateName: 'Terceiro Lugar', score: 100, reward: 'R$ 100,00 (Mock)' },
  { position: 4, affiliateName: 'Quarto Afiliado', score: 95, reward: 'N/A' },
  { position: 5, affiliateName: 'Quinto Afiliado', score: 90, reward: 'N/A' },
];

const RankingsSettings: React.FC = () => {
  const [config, setConfig] = useState<RankingConfig>(initialRankingConfig);
  const [showExampleRanking, setShowExampleRanking] = useState(false);

  const handleConfigChange = (field: keyof Omit<RankingConfig, 'rewards' | 'id' | 'criteria'>, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleCriteriaChange = (criterion: string) => {
    setConfig(prev => ({
      ...prev,
      criteria: prev.criteria.includes(criterion)
        ? prev.criteria.filter(c => c !== criterion)
        : [...prev.criteria, criterion],
    }));
  };

  const handleRewardChange = (index: number, value: string) => {
    const newRewards = [...config.rewards];
    newRewards[index].rewardValue = value;
    setConfig(prev => ({ ...prev, rewards: newRewards }));
  };

  const handleSaveConfig = () => {
    console.log('Saving Ranking Config (mock):', config);
    alert('Configurações do Ranking salvas (mock)!');
    setShowExampleRanking(true); // Show example after saving for mock purposes
  };

  const availableCriteria = [
    'Número de indicações diretas válidas',
    'GGR total da rede',
    'Número de jogadores ativos na rede',
    'Maior sequência diária',
  ];

  return (
    <div className="p-1 md:p-6 bg-cinza-claro rounded-lg shadow-md min-h-[400px]">
      <h2 className="text-xl lg:text-2xl font-semibold text-branco mb-6 font-sora">Configurar Tipos de Ranking</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Form */}
        <div className="p-4 md:p-6 bg-cinza-escuro rounded-lg shadow">
          <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">{config.id === 'new' ? 'Criar Novo Ranking' : `Editar Ranking: ${config.name}`}</h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <label htmlFor="rankingName" className="block font-medium text-gray-300 mb-1">Nome do Ranking:</label>
              <input 
                type="text" 
                id="rankingName" 
                value={config.name}
                onChange={(e) => handleConfigChange('name', e.target.value)}
                className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              />
            </div>
            <div>
              <label htmlFor="rankingPeriod" className="block font-medium text-gray-300 mb-1">Período de Apuração:</label>
              <select 
                id="rankingPeriod" 
                value={config.period}
                onChange={(e) => handleConfigChange('period', e.target.value as RankingConfig['period'])}
                className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              >
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
                <option value="quinzenal">Quinzenal</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-gray-300 mb-1">Critérios de Classificação:</label>
              <div className="space-y-1">
                {availableCriteria.map(crit => (
                  <label key={crit} className="flex items-center text-gray-300">
                    <input 
                      type="checkbox" 
                      checked={config.criteria.includes(crit)}
                      onChange={() => handleCriteriaChange(crit)}
                      className="mr-2 h-4 w-4 rounded bg-gray-700 border-gray-600 text-azul-ciano focus:ring-azul-ciano"
                    />
                    {crit}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="tieBreaker" className="block font-medium text-gray-300 mb-1">Critérios de Desempate:</label>
              <input 
                type="text" 
                id="tieBreaker" 
                value={config.tieBreaker}
                onChange={(e) => handleConfigChange('tieBreaker', e.target.value)}
                className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
              />
            </div>

            <h4 className="text-md font-semibold text-gray-200 pt-2">Recompensas por Posição (Top 3):</h4>
            {config.rewards.map((reward, index) => (
              <div key={reward.position} className="flex items-center gap-2">
                <label htmlFor={`rewardPos${reward.position}`} className="font-medium text-gray-300 w-16">{reward.position}º Lugar (R$):</label>
                <input 
                  type="number" 
                  id={`rewardPos${reward.position}`}
                  value={reward.rewardValue}
                  onChange={(e) => handleRewardChange(index, e.target.value)}
                  className="flex-1 p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-azul-ciano outline-none"
                  placeholder="Ex: 1000"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleSaveConfig}
              className="px-5 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
            >
              Salvar Configuração do Ranking
            </button>
          </div>
        </div>

        {/* Example Ranking Visualization */}
        {showExampleRanking && (
          <div className="p-4 md:p-6 bg-cinza-escuro rounded-lg shadow">
            <h3 className="text-lg lg:text-xl font-semibold text-azul-ciano mb-4">Visualização de Ranking Exemplo: {config.name}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-branco">
                <thead className="bg-gray-700 text-xs uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-3">Posição</th>
                    <th scope="col" className="px-6 py-3">Nome do Afiliado</th>
                    <th scope="col" className="px-6 py-3">Pontuação/Critério</th>
                    <th scope="col" className="px-6 py-3">Recompensa</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRankingData.slice(0, config.rewards.length).map((row) => (
                    <tr key={row.position} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="px-4 py-3 font-medium">{row.position}º</td>
                      <td className="px-6 py-3">{row.affiliateName}</td>
                      <td className="px-6 py-3">{row.score}</td>
                      <td className="px-6 py-3">{config.rewards.find(r => r.position === row.position)?.rewardValue ? `R$ ${config.rewards.find(r => r.position === row.position)?.rewardValue}` : 'N/A'}</td>
                    </tr>
                  ))}
                  {mockRankingData.length === 0 && (
                     <tr><td colSpan={4} className="text-center py-4 text-gray-400">Nenhum dado no ranking exemplo.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {/* Gerenciamento de Períodos de Ranking e Log de Pagamento - Omitido conforme feedback do usuário para o mockup */}
    </div>
  );
};

export default RankingsSettings;

