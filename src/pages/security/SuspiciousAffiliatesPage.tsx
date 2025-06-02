import React, { useState } from 'react';
import { AlertTriangle, Eye, Download } from 'lucide-react';

interface SuspiciousAffiliate {
  id: string;
  name: string;
  email: string;
  category: string;
  totalCommissions: number;
  networkGGR: number;
  suspiciousRatio: number;
  networkSize: number;
  activeClients: number;
  avgDepositPerClient: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastActivity: string;
  registrationDate: string;
  flags: string[];
}

interface NetworkMember {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  totalDeposits: number;
  totalWithdrawals: number;
  gameActivity: number;
  lastLogin: string;
  status: 'active' | 'inactive' | 'suspicious';
  cpaValidated: boolean;
  additionalActivity: boolean;
}

const SuspiciousAffiliatesPage: React.FC = () => {
  const [suspiciousAffiliates] = useState<SuspiciousAffiliate[]>([
    {
      id: 'aff001',
      name: 'Carlos Mendes',
      email: 'carlos.mendes@email.com',
      category: 'Expert',
      totalCommissions: 45000,
      networkGGR: 12000,
      suspiciousRatio: 3.75,
      networkSize: 150,
      activeClients: 45,
      avgDepositPerClient: 267,
      riskLevel: 'critical',
      lastActivity: '2025-06-02T10:30:00Z',
      registrationDate: '2024-08-15',
      flags: ['Comissões > GGR', 'Baixa atividade de jogos', 'Padrão CPA mínimo'],
    },
    {
      id: 'aff002',
      name: 'Ana Silva',
      email: 'ana.silva@email.com',
      category: 'Profissional',
      totalCommissions: 28000,
      networkGGR: 15000,
      suspiciousRatio: 1.87,
      networkSize: 89,
      activeClients: 32,
      avgDepositPerClient: 469,
      riskLevel: 'high',
      lastActivity: '2025-06-02T09:15:00Z',
      registrationDate: '2024-09-22',
      flags: ['Comissões > GGR', 'Atividade concentrada'],
    },
    {
      id: 'aff003',
      name: 'Roberto Costa',
      email: 'roberto.costa@email.com',
      category: 'Afiliado',
      totalCommissions: 15000,
      networkGGR: 11000,
      suspiciousRatio: 1.36,
      networkSize: 67,
      activeClients: 28,
      avgDepositPerClient: 393,
      riskLevel: 'medium',
      lastActivity: '2025-06-02T08:45:00Z',
      registrationDate: '2024-11-10',
      flags: ['Comissões > GGR'],
    }
  ]);

  const [selectedAffiliate, setSelectedAffiliate] = useState<SuspiciousAffiliate | null>(null);
  const [networkMembers] = useState<NetworkMember[]>([
    {
      id: 'client001',
      name: 'João Santos',
      email: 'joao.santos@email.com',
      registrationDate: '2025-01-15',
      totalDeposits: 500,
      totalWithdrawals: 0,
      gameActivity: 2,
      lastLogin: '2025-01-16T10:00:00Z',
      status: 'suspicious',
      cpaValidated: true,
      additionalActivity: false,
    },
    {
      id: 'client002',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@email.com',
      registrationDate: '2025-01-20',
      totalDeposits: 300,
      totalWithdrawals: 0,
      gameActivity: 1,
      lastLogin: '2025-01-21T14:30:00Z',
      status: 'suspicious',
      cpaValidated: true,
      additionalActivity: false,
    },
    {
      id: 'client003',
      name: 'Pedro Lima',
      email: 'pedro.lima@email.com',
      registrationDate: '2025-02-01',
      totalDeposits: 450,
      totalWithdrawals: 0,
      gameActivity: 3,
      lastLogin: '2025-02-02T16:15:00Z',
      status: 'active',
      cpaValidated: true,
      additionalActivity: true,
    }
  ]);

  const [filters, setFilters] = useState({
    riskLevel: '',
    category: '',
    minRatio: '',
  });

  const riskColors = {
    low: 'text-green-400 bg-green-400/10 border-green-400/30',
    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    high: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    critical: 'text-red-400 bg-red-400/10 border-red-400/30',
  };

  const statusColors = {
    active: 'text-green-400 bg-green-400/10 border-green-400/30',
    inactive: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
    suspicious: 'text-red-400 bg-red-400/10 border-red-400/30',
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const exportReport = () => {
    const data = suspiciousAffiliates.map(affiliate => ({
      'Nome': affiliate.name,
      'Email': affiliate.email,
      'Categoria': affiliate.category,
      'Comissões Totais': formatCurrency(affiliate.totalCommissions),
      'GGR da Rede': formatCurrency(affiliate.networkGGR),
      'Ratio Suspeito': affiliate.suspiciousRatio.toFixed(2),
      'Tamanho da Rede': affiliate.networkSize,
      'Clientes Ativos': affiliate.activeClients,
      'Nível de Risco': affiliate.riskLevel.toUpperCase(),
      'Flags': affiliate.flags.join(', '),
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `afiliados_suspeitos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredAffiliates = suspiciousAffiliates.filter(affiliate => {
    return (
      (filters.riskLevel === '' || affiliate.riskLevel === filters.riskLevel) &&
      (filters.category === '' || affiliate.category === filters.category) &&
      (filters.minRatio === '' || affiliate.suspiciousRatio >= parseFloat(filters.minRatio))
    );
  });

  return (
    <div className="bg-cinza-escuro p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-branco flex items-center">
          <AlertTriangle className="mr-3" size={24} />
          🚨 Ranking de Afiliados Suspeitos
        </h2>
        <div className="flex items-center gap-4">
          <span className="bg-vermelho text-branco px-3 py-1 rounded-full text-sm font-medium">
            ⚠️ {filteredAffiliates.length} Afiliados Detectados
          </span>
          <button
            onClick={exportReport}
            className="flex items-center px-4 py-2 bg-azul-ciano text-branco rounded-md hover:bg-azul-ciano/80"
          >
            <Download className="mr-2" size={16} />
            Exportar Relatório
          </button>
        </div>
      </div>

      <div className="mb-4 p-4 bg-vermelho/10 border border-vermelho/30 rounded-lg">
        <p className="text-vermelho text-sm">
          🔍 DETECÇÃO AUTOMÁTICA ATIVA - Afiliados com comissões superiores ao GGR gerado por sua rede. 
          Possível indicativo de fraude ou manipulação do sistema.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-cinza-claro p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Nível de Risco</label>
            <select
              value={filters.riskLevel}
              onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
              className="w-full px-2 py-1 bg-cinza-escuro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="critical">Crítico</option>
              <option value="high">Alto</option>
              <option value="medium">Médio</option>
              <option value="low">Baixo</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Categoria</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-2 py-1 bg-cinza-escuro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
            >
              <option value="">Todas</option>
              <option value="Expert">Expert</option>
              <option value="Profissional">Profissional</option>
              <option value="Afiliado">Afiliado</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Ratio Mínimo</label>
            <input
              type="number"
              step="0.1"
              value={filters.minRatio}
              onChange={(e) => setFilters({ ...filters, minRatio: e.target.value })}
              className="w-full px-2 py-1 bg-cinza-escuro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
              placeholder="Ex: 1.5"
            />
          </div>
        </div>
      </div>

      {/* Lista de Afiliados Suspeitos */}
      <div className="space-y-4 mb-6">
        {filteredAffiliates.map((affiliate, index) => (
          <div key={affiliate.id} className="bg-cinza-claro p-4 rounded-lg border-l-4 border-vermelho">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-red-500 text-white' :
                  index === 1 ? 'bg-orange-500 text-white' :
                  'bg-yellow-500 text-black'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-branco">{affiliate.name}</h3>
                  <p className="text-sm text-gray-400">{affiliate.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium border ${riskColors[affiliate.riskLevel]}`}>
                  {affiliate.riskLevel.toUpperCase()}
                </span>
                <button
                  onClick={() => setSelectedAffiliate(affiliate)}
                  className="flex items-center px-3 py-1 bg-azul-ciano text-branco rounded text-sm hover:bg-azul-ciano/80"
                >
                  <Eye className="mr-1" size={14} />
                  Analisar Rede
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-vermelho">{formatCurrency(affiliate.totalCommissions)}</div>
                <div className="text-xs text-gray-400">Comissões Totais</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amarelo">{formatCurrency(affiliate.networkGGR)}</div>
                <div className="text-xs text-gray-400">GGR da Rede</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-branco">{affiliate.suspiciousRatio.toFixed(2)}x</div>
                <div className="text-xs text-gray-400">Ratio Suspeito</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-azul-ciano">{affiliate.networkSize}</div>
                <div className="text-xs text-gray-400">Tamanho da Rede</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {affiliate.flags.map((flag, flagIndex) => (
                <span key={flagIndex} className="px-2 py-1 bg-vermelho/20 text-vermelho rounded text-xs">
                  {flag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Análise de Rede */}
      {selectedAffiliate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-cinza-escuro p-6 rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-branco">
                Análise Detalhada da Rede - {selectedAffiliate.name}
              </h3>
              <button
                onClick={() => setSelectedAffiliate(null)}
                className="px-4 py-2 bg-gray-600 text-branco rounded-md hover:bg-gray-600/80"
              >
                Fechar
              </button>
            </div>

            {/* Métricas da Rede */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-cinza-claro p-3 rounded">
                <div className="text-xl font-bold text-vermelho">{selectedAffiliate.networkSize}</div>
                <div className="text-sm text-gray-400">Total de Clientes</div>
              </div>
              <div className="bg-cinza-claro p-3 rounded">
                <div className="text-xl font-bold text-amarelo">{selectedAffiliate.activeClients}</div>
                <div className="text-sm text-gray-400">Clientes Ativos</div>
              </div>
              <div className="bg-cinza-claro p-3 rounded">
                <div className="text-xl font-bold text-azul-ciano">{formatCurrency(selectedAffiliate.avgDepositPerClient)}</div>
                <div className="text-sm text-gray-400">Depósito Médio</div>
              </div>
              <div className="bg-cinza-claro p-3 rounded">
                <div className="text-xl font-bold text-verde">{((selectedAffiliate.activeClients / selectedAffiliate.networkSize) * 100).toFixed(1)}%</div>
                <div className="text-sm text-gray-400">Taxa de Atividade</div>
              </div>
            </div>

            {/* Lista de Membros da Rede */}
            <div className="bg-cinza-claro rounded-lg overflow-hidden">
              <div className="p-4 bg-cinza-escuro">
                <h4 className="font-semibold text-branco">Membros da Rede (Amostra)</h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-cinza-medio sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-300">Cliente</th>
                      <th className="px-3 py-2 text-left text-gray-300">Registro</th>
                      <th className="px-3 py-2 text-left text-gray-300">Depósitos</th>
                      <th className="px-3 py-2 text-left text-gray-300">Atividade</th>
                      <th className="px-3 py-2 text-left text-gray-300">Status</th>
                      <th className="px-3 py-2 text-left text-gray-300">CPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {networkMembers.map(member => (
                      <tr key={member.id} className="border-t border-gray-600 hover:bg-cinza-escuro/30">
                        <td className="px-3 py-2">
                          <div className="text-branco font-medium">{member.name}</div>
                          <div className="text-gray-400 text-xs">{member.email}</div>
                        </td>
                        <td className="px-3 py-2 text-gray-300 text-xs">
                          {new Date(member.registrationDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-3 py-2 text-gray-300">
                          {formatCurrency(member.totalDeposits)}
                        </td>
                        <td className="px-3 py-2 text-gray-300">
                          <div>{member.gameActivity} jogos</div>
                          <div className="text-xs text-gray-500">
                            {member.additionalActivity ? 'Atividade adicional' : 'Apenas CPA'}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[member.status]}`}>
                            {member.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            member.cpaValidated ? 'bg-verde/20 text-verde' : 'bg-vermelho/20 text-vermelho'
                          }`}>
                            {member.cpaValidated ? 'Validado' : 'Pendente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuspiciousAffiliatesPage;

