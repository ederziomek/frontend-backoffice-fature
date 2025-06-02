import React, { useState } from 'react';
import { Users, TrendingUp, AlertTriangle, Eye, Network, Search } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  email: string;
  type: 'affiliate' | 'client';
  level: number;
  parentId?: string;
  totalEarnings: number;
  networkSize: number;
  isActive: boolean;
  riskScore: number;
  registrationDate: string;
}

const NetworkAnalysisPage: React.FC = () => {
  const [networkNodes] = useState<NetworkNode[]>([
    {
      id: 'aff001',
      name: 'Carlos Mendes',
      email: 'carlos.mendes@email.com',
      type: 'affiliate',
      level: 0,
      totalEarnings: 45000,
      networkSize: 150,
      isActive: true,
      riskScore: 85,
      registrationDate: '2024-08-15',
    },
    {
      id: 'aff002',
      name: 'Ana Silva',
      email: 'ana.silva@email.com',
      type: 'affiliate',
      level: 1,
      parentId: 'aff001',
      totalEarnings: 28000,
      networkSize: 89,
      isActive: true,
      riskScore: 72,
      registrationDate: '2024-09-22',
    },
    {
      id: 'client001',
      name: 'João Santos',
      email: 'joao.santos@email.com',
      type: 'client',
      level: 2,
      parentId: 'aff002',
      totalEarnings: 0,
      networkSize: 0,
      isActive: false,
      riskScore: 45,
      registrationDate: '2025-01-15',
    },
    {
      id: 'client002',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@email.com',
      type: 'client',
      level: 2,
      parentId: 'aff002',
      totalEarnings: 0,
      networkSize: 0,
      isActive: true,
      riskScore: 30,
      registrationDate: '2025-01-20',
    },
  ]);

  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 80) return 'text-red-400 bg-red-400/10 border-red-400/30';
    if (riskScore >= 60) return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
    if (riskScore >= 40) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    return 'text-green-400 bg-green-400/10 border-green-400/30';
  };

  const getTypeColor = (type: string) => {
    return type === 'affiliate' ? 'text-azul-ciano bg-azul-ciano/10' : 'text-gray-400 bg-gray-400/10';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const filteredNodes = networkNodes.filter(node =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNetworkDepth = (nodeId: string, depth = 0): number => {
    const children = networkNodes.filter(node => node.parentId === nodeId);
    if (children.length === 0) return depth;
    return Math.max(...children.map(child => getNetworkDepth(child.id, depth + 1)));
  };

  return (
    <div className="bg-cinza-escuro p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-branco flex items-center">
          <Network className="mr-3" size={24} />
          🕸️ Análise de Rede de Afiliados
        </h2>
        <div className="flex items-center gap-4">
          <span className="bg-azul-ciano text-branco px-3 py-1 rounded-full text-sm font-medium">
            📊 {networkNodes.length} Nós Analisados
          </span>
        </div>
      </div>

      <div className="mb-4 p-4 bg-azul-ciano/10 border border-azul-ciano/30 rounded-lg">
        <p className="text-azul-ciano text-sm">
          🔍 ANÁLISE DE REDE ATIVA - Mapeamento completo das conexões entre afiliados e clientes. 
          Identifica padrões suspeitos e estruturas de rede anômalas.
        </p>
      </div>

      {/* Barra de Pesquisa */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Pesquisar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cinza-claro text-branco rounded-lg border border-gray-600 focus:border-azul-ciano focus:outline-none"
          />
        </div>
      </div>

      {/* Métricas da Rede */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-cinza-claro p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-azul-ciano">{networkNodes.filter(n => n.type === 'affiliate').length}</div>
              <div className="text-sm text-gray-400">Afiliados Ativos</div>
            </div>
            <Users className="text-azul-ciano" size={24} />
          </div>
        </div>
        <div className="bg-cinza-claro p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-verde">{networkNodes.filter(n => n.type === 'client').length}</div>
              <div className="text-sm text-gray-400">Clientes Conectados</div>
            </div>
            <TrendingUp className="text-verde" size={24} />
          </div>
        </div>
        <div className="bg-cinza-claro p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-amarelo">{getNetworkDepth('aff001')}</div>
              <div className="text-sm text-gray-400">Profundidade Máxima</div>
            </div>
            <Network className="text-amarelo" size={24} />
          </div>
        </div>
        <div className="bg-cinza-claro p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-vermelho">{networkNodes.filter(n => n.riskScore >= 70).length}</div>
              <div className="text-sm text-gray-400">Nós de Alto Risco</div>
            </div>
            <AlertTriangle className="text-vermelho" size={24} />
          </div>
        </div>
      </div>

      {/* Visualização da Rede */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Nós */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-branco mb-4">Estrutura da Rede</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredNodes.map(node => (
              <div
                key={node.id}
                className={`bg-cinza-claro p-4 rounded-lg border-l-4 cursor-pointer hover:bg-cinza-medio transition-colors ${
                  node.riskScore >= 70 ? 'border-vermelho' : 
                  node.riskScore >= 50 ? 'border-amarelo' : 'border-verde'
                }`}
                onClick={() => setSelectedNode(node)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      node.type === 'affiliate' ? 'bg-azul-ciano' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <h4 className="font-semibold text-branco">{node.name}</h4>
                      <p className="text-sm text-gray-400">{node.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(node.type)}`}>
                      {node.type.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(node.riskScore)}`}>
                      Risco: {node.riskScore}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Nível</div>
                    <div className="text-branco font-medium">{node.level}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Rede</div>
                    <div className="text-branco font-medium">{node.networkSize}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Ganhos</div>
                    <div className="text-branco font-medium">{formatCurrency(node.totalEarnings)}</div>
                  </div>
                </div>

                {node.parentId && (
                  <div className="mt-2 text-xs text-gray-400">
                    Referenciado por: {networkNodes.find(n => n.id === node.parentId)?.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detalhes do Nó Selecionado */}
        <div>
          <h3 className="text-lg font-semibold text-branco mb-4">Detalhes do Nó</h3>
          {selectedNode ? (
            <div className="bg-cinza-claro p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-4 h-4 rounded-full ${
                  selectedNode.type === 'affiliate' ? 'bg-azul-ciano' : 'bg-gray-400'
                }`}></div>
                <div>
                  <h4 className="font-semibold text-branco">{selectedNode.name}</h4>
                  <p className="text-sm text-gray-400">{selectedNode.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tipo:</span>
                  <span className="text-branco">{selectedNode.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Nível na Rede:</span>
                  <span className="text-branco">{selectedNode.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Score de Risco:</span>
                  <span className={`font-medium ${
                    selectedNode.riskScore >= 70 ? 'text-vermelho' :
                    selectedNode.riskScore >= 50 ? 'text-amarelo' : 'text-verde'
                  }`}>{selectedNode.riskScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tamanho da Rede:</span>
                  <span className="text-branco">{selectedNode.networkSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ganhos Totais:</span>
                  <span className="text-branco">{formatCurrency(selectedNode.totalEarnings)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={selectedNode.isActive ? 'text-verde' : 'text-vermelho'}>
                    {selectedNode.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Registro:</span>
                  <span className="text-branco">
                    {new Date(selectedNode.registrationDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              {selectedNode.parentId && (
                <div className="mt-4 p-3 bg-cinza-escuro rounded">
                  <div className="text-sm text-gray-400 mb-1">Referenciado por:</div>
                  <div className="text-branco font-medium">
                    {networkNodes.find(n => n.id === selectedNode.parentId)?.name}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <button className="w-full px-4 py-2 bg-azul-ciano text-branco rounded hover:bg-azul-ciano/80">
                  <Eye className="inline mr-2" size={16} />
                  Investigar Detalhadamente
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-cinza-claro p-4 rounded-lg text-center text-gray-400">
              Selecione um nó da rede para ver os detalhes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkAnalysisPage;

