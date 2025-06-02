import React, { useState } from 'react';
import { Shield, AlertCircle, TrendingUp, Target } from 'lucide-react';

interface FraudPattern {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedCount: number;
  lastDetection: string;
  affectedAffiliates: number;
  potentialLoss: number;
}

interface FraudAlert {
  id: string;
  affiliateId: string;
  affiliateName: string;
  patternType: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  evidence: string[];
}

const FraudDetectionPage: React.FC = () => {
  const [fraudPatterns] = useState<FraudPattern[]>([
    {
      id: 'pattern001',
      type: 'CPA Mínimo Suspeito',
      description: 'Afiliados com redes que cumprem exatamente o CPA mínimo sem atividade adicional',
      severity: 'high',
      detectedCount: 23,
      lastDetection: '2025-06-02T10:30:00Z',
      affectedAffiliates: 8,
      potentialLoss: 45000,
    },
    {
      id: 'pattern002',
      type: 'Comissões Desproporcionais',
      description: 'Comissões superiores ao GGR gerado pela rede do afiliado',
      severity: 'critical',
      detectedCount: 15,
      lastDetection: '2025-06-02T09:45:00Z',
      affectedAffiliates: 5,
      potentialLoss: 78000,
    },
    {
      id: 'pattern003',
      type: 'Atividade Concentrada',
      description: 'Múltiplos registros em horários muito próximos do mesmo IP',
      severity: 'medium',
      detectedCount: 42,
      lastDetection: '2025-06-02T11:15:00Z',
      affectedAffiliates: 12,
      potentialLoss: 23000,
    },
    {
      id: 'pattern004',
      type: 'Padrão de Depósito Artificial',
      description: 'Depósitos em valores exatos e sequenciais indicando automação',
      severity: 'high',
      detectedCount: 18,
      lastDetection: '2025-06-02T08:20:00Z',
      affectedAffiliates: 6,
      potentialLoss: 34000,
    },
  ]);

  const [fraudAlerts] = useState<FraudAlert[]>([
    {
      id: 'alert001',
      affiliateId: 'aff001',
      affiliateName: 'Carlos Mendes',
      patternType: 'Comissões Desproporcionais',
      description: 'Afiliado recebeu R$ 45.000 em comissões enquanto sua rede gerou apenas R$ 12.000 em GGR',
      severity: 'critical',
      detectedAt: '2025-06-02T10:30:00Z',
      status: 'new',
      evidence: [
        'Ratio comissão/GGR: 3.75x',
        'Rede com 150 clientes, apenas 45 ativos',
        'Depósitos médios baixos: R$ 267',
        'Atividade de jogos mínima'
      ],
    },
    {
      id: 'alert002',
      affiliateId: 'aff005',
      affiliateName: 'Lucas Ferreira',
      patternType: 'CPA Mínimo Suspeito',
      description: 'Rede com 89 clientes que cumprem exatamente o CPA sem atividade adicional',
      severity: 'high',
      detectedAt: '2025-06-02T09:15:00Z',
      status: 'investigating',
      evidence: [
        '89 clientes registrados',
        'Todos fizeram depósito mínimo de R$ 30',
        'Média de 1.2 jogos por cliente',
        'Nenhuma atividade após validação CPA'
      ],
    },
    {
      id: 'alert003',
      affiliateId: 'aff012',
      affiliateName: 'Marina Santos',
      patternType: 'Atividade Concentrada',
      description: '25 registros em 2 horas do mesmo bloco de IP',
      severity: 'medium',
      detectedAt: '2025-06-02T11:15:00Z',
      status: 'new',
      evidence: [
        'IP range: 192.168.1.x',
        'Registros entre 14:00-16:00',
        'Nomes sequenciais suspeitos',
        'Emails com padrão similar'
      ],
    },
  ]);

  const [selectedTab, setSelectedTab] = useState<'patterns' | 'alerts'>('patterns');

  const severityColors = {
    low: 'text-green-400 bg-green-400/10 border-green-400/30',
    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    high: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    critical: 'text-red-400 bg-red-400/10 border-red-400/30',
  };

  const statusColors = {
    new: 'text-red-400 bg-red-400/10 border-red-400/30',
    investigating: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    resolved: 'text-green-400 bg-green-400/10 border-green-400/30',
    false_positive: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const totalPotentialLoss = fraudPatterns.reduce((sum, pattern) => sum + pattern.potentialLoss, 0);
  const totalDetections = fraudPatterns.reduce((sum, pattern) => sum + pattern.detectedCount, 0);
  const criticalAlerts = fraudAlerts.filter(alert => alert.severity === 'critical').length;

  return (
    <div className="bg-cinza-escuro p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-branco flex items-center">
          <Shield className="mr-3" size={24} />
          🛡️ Sistema de Detecção de Fraudes
        </h2>
        <div className="flex items-center gap-4">
          <span className="bg-verde text-branco px-3 py-1 rounded-full text-sm font-medium">
            ✅ Sistema Ativo
          </span>
        </div>
      </div>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-cinza-claro p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-vermelho">{totalDetections}</div>
              <div className="text-sm text-gray-400">Detecções Totais</div>
            </div>
            <AlertCircle className="text-vermelho" size={24} />
          </div>
        </div>
        <div className="bg-cinza-claro p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-amarelo">{criticalAlerts}</div>
              <div className="text-sm text-gray-400">Alertas Críticos</div>
            </div>
            <Target className="text-amarelo" size={24} />
          </div>
        </div>
        <div className="bg-cinza-claro p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-azul-ciano">{formatCurrency(totalPotentialLoss)}</div>
              <div className="text-sm text-gray-400">Perda Potencial</div>
            </div>
            <TrendingUp className="text-azul-ciano" size={24} />
          </div>
        </div>
        <div className="bg-cinza-claro p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-verde">98.5%</div>
              <div className="text-sm text-gray-400">Precisão do Sistema</div>
            </div>
            <Shield className="text-verde" size={24} />
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="flex border-b border-gray-600 mb-6">
        <button
          onClick={() => setSelectedTab('patterns')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'patterns'
              ? 'text-azul-ciano border-b-2 border-azul-ciano'
              : 'text-gray-400 hover:text-branco'
          }`}
        >
          Padrões de Fraude
        </button>
        <button
          onClick={() => setSelectedTab('alerts')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'alerts'
              ? 'text-azul-ciano border-b-2 border-azul-ciano'
              : 'text-gray-400 hover:text-branco'
          }`}
        >
          Alertas Ativos
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {selectedTab === 'patterns' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-branco mb-4">Padrões de Fraude Detectados</h3>
          {fraudPatterns.map(pattern => (
            <div key={pattern.id} className="bg-cinza-claro p-4 rounded-lg border-l-4 border-vermelho">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-branco">{pattern.type}</h4>
                  <p className="text-sm text-gray-400">{pattern.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${severityColors[pattern.severity]}`}>
                  {pattern.severity.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-vermelho">{pattern.detectedCount}</div>
                  <div className="text-xs text-gray-400">Detecções</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-amarelo">{pattern.affectedAffiliates}</div>
                  <div className="text-xs text-gray-400">Afiliados Afetados</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-azul-ciano">{formatCurrency(pattern.potentialLoss)}</div>
                  <div className="text-xs text-gray-400">Perda Potencial</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-branco">{formatDate(pattern.lastDetection)}</div>
                  <div className="text-xs text-gray-400">Última Detecção</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'alerts' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-branco mb-4">Alertas de Fraude Ativos</h3>
          {fraudAlerts.map(alert => (
            <div key={alert.id} className="bg-cinza-claro p-4 rounded-lg border-l-4 border-vermelho">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-branco">{alert.affiliateName}</h4>
                  <p className="text-sm text-gray-400">{alert.patternType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${severityColors[alert.severity]}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[alert.status]}`}>
                    {alert.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-branco mb-3">{alert.description}</p>

              <div className="mb-3">
                <h5 className="text-sm font-medium text-gray-300 mb-2">Evidências:</h5>
                <ul className="space-y-1">
                  {alert.evidence.map((evidence, index) => (
                    <li key={index} className="text-sm text-gray-400 flex items-center">
                      <span className="w-2 h-2 bg-vermelho rounded-full mr-2"></span>
                      {evidence}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Detectado em: {formatDate(alert.detectedAt)}</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-azul-ciano text-branco rounded text-xs hover:bg-azul-ciano/80">
                    Investigar
                  </button>
                  <button className="px-3 py-1 bg-verde text-branco rounded text-xs hover:bg-verde/80">
                    Marcar como Resolvido
                  </button>
                  <button className="px-3 py-1 bg-gray-600 text-branco rounded text-xs hover:bg-gray-600/80">
                    Falso Positivo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FraudDetectionPage;

