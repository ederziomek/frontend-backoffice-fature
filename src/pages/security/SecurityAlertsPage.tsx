import React, { useState } from 'react';
import { Eye, AlertTriangle, Clock, CheckCircle, XCircle, Bell, Filter } from 'lucide-react';

interface SecurityAlert {
  id: string;
  type: 'fraud_detection' | 'suspicious_activity' | 'system_anomaly' | 'compliance_violation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
  affectedEntity: string;
  entityType: 'affiliate' | 'client' | 'system';
  evidence: string[];
  assignedTo?: string;
  resolution?: string;
}

const SecurityAlertsPage: React.FC = () => {
  const [alerts] = useState<SecurityAlert[]>([
    {
      id: 'alert001',
      type: 'fraud_detection',
      title: 'Comissões Desproporcionais Detectadas',
      description: 'Afiliado Carlos Mendes apresenta comissões 3.75x superiores ao GGR gerado por sua rede',
      severity: 'critical',
      status: 'new',
      createdAt: '2025-06-02T10:30:00Z',
      updatedAt: '2025-06-02T10:30:00Z',
      affectedEntity: 'Carlos Mendes',
      entityType: 'affiliate',
      evidence: [
        'Ratio comissão/GGR: 3.75x',
        'Rede com 150 clientes, apenas 45 ativos',
        'Depósitos médios baixos: R$ 267',
        'Atividade de jogos mínima'
      ],
    },
    {
      id: 'alert002',
      type: 'suspicious_activity',
      title: 'Padrão CPA Mínimo Suspeito',
      description: 'Rede de afiliado com 89 clientes que cumprem exatamente o CPA sem atividade adicional',
      severity: 'high',
      status: 'investigating',
      createdAt: '2025-06-02T09:15:00Z',
      updatedAt: '2025-06-02T11:00:00Z',
      affectedEntity: 'Lucas Ferreira',
      entityType: 'affiliate',
      evidence: [
        '89 clientes registrados',
        'Todos fizeram depósito mínimo de R$ 30',
        'Média de 1.2 jogos por cliente',
        'Nenhuma atividade após validação CPA'
      ],
      assignedTo: 'Admin Principal',
    },
    {
      id: 'alert003',
      type: 'system_anomaly',
      title: 'Múltiplos Registros do Mesmo IP',
      description: '25 registros em 2 horas do mesmo bloco de IP',
      severity: 'medium',
      status: 'new',
      createdAt: '2025-06-02T11:15:00Z',
      updatedAt: '2025-06-02T11:15:00Z',
      affectedEntity: 'Marina Santos',
      entityType: 'affiliate',
      evidence: [
        'IP range: 192.168.1.x',
        'Registros entre 14:00-16:00',
        'Nomes sequenciais suspeitos',
        'Emails com padrão similar'
      ],
    },
    {
      id: 'alert004',
      type: 'compliance_violation',
      title: 'Violação de Política de Idade',
      description: 'Cliente registrado com idade inferior ao permitido',
      severity: 'high',
      status: 'resolved',
      createdAt: '2025-06-01T15:30:00Z',
      updatedAt: '2025-06-02T08:00:00Z',
      affectedEntity: 'João Silva Jr.',
      entityType: 'client',
      evidence: [
        'Idade declarada: 16 anos',
        'Documento não validado',
        'Depósito realizado'
      ],
      assignedTo: 'Compliance Team',
      resolution: 'Conta suspensa e depósito estornado. Cliente notificado sobre política de idade mínima.',
    },
    {
      id: 'alert005',
      type: 'fraud_detection',
      title: 'Padrão de Depósito Artificial',
      description: 'Depósitos em valores exatos e sequenciais indicando automação',
      severity: 'high',
      status: 'dismissed',
      createdAt: '2025-06-01T12:20:00Z',
      updatedAt: '2025-06-02T09:30:00Z',
      affectedEntity: 'Roberto Costa',
      entityType: 'affiliate',
      evidence: [
        'Depósitos: R$ 100, R$ 200, R$ 300, R$ 400',
        'Intervalos de exatamente 1 hora',
        'Mesmo método de pagamento',
        'Clientes com nomes similares'
      ],
      assignedTo: 'Security Team',
      resolution: 'Falso positivo - Cliente confirmou que os depósitos foram legítimos e planejados.',
    },
  ]);

  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [filters, setFilters] = useState({
    severity: '',
    status: '',
    type: '',
  });

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
    dismissed: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
  };

  const typeIcons = {
    fraud_detection: AlertTriangle,
    suspicious_activity: Eye,
    system_anomaly: Clock,
    compliance_violation: XCircle,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const filteredAlerts = alerts.filter(alert => {
    return (
      (filters.severity === '' || alert.severity === filters.severity) &&
      (filters.status === '' || alert.status === filters.status) &&
      (filters.type === '' || alert.type === filters.type)
    );
  });

  const alertCounts = {
    total: alerts.length,
    new: alerts.filter(a => a.status === 'new').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    investigating: alerts.filter(a => a.status === 'investigating').length,
  };

  const updateAlertStatus = (alertId: string, newStatus: SecurityAlert['status']) => {
    // Simulação de atualização de status
    console.log(`Atualizando alerta ${alertId} para status: ${newStatus}`);
  };

  return (
    <div className="bg-cinza-escuro p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-branco flex items-center">
          <Bell className="mr-3" size={24} />
          🚨 Central de Alertas de Segurança
        </h2>
        <div className="flex items-center gap-4">
          <span className="bg-vermelho text-branco px-3 py-1 rounded-full text-sm font-medium">
            ⚠️ {alertCounts.new} Novos Alertas
          </span>
        </div>
      </div>

      {/* Métricas dos Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-cinza-claro p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-azul-ciano">{alertCounts.total}</div>
              <div className="text-sm text-gray-400">Total de Alertas</div>
            </div>
            <Bell className="text-azul-ciano" size={24} />
          </div>
        </div>
        <div className="bg-cinza-claro p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-vermelho">{alertCounts.new}</div>
              <div className="text-sm text-gray-400">Novos Alertas</div>
            </div>
            <AlertTriangle className="text-vermelho" size={24} />
          </div>
        </div>
        <div className="bg-cinza-claro p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-amarelo">{alertCounts.critical}</div>
              <div className="text-sm text-gray-400">Críticos</div>
            </div>
            <XCircle className="text-amarelo" size={24} />
          </div>
        </div>
        <div className="bg-cinza-claro p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-verde">{alertCounts.investigating}</div>
              <div className="text-sm text-gray-400">Em Investigação</div>
            </div>
            <Eye className="text-verde" size={24} />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-cinza-claro p-4 rounded-lg mb-6">
        <div className="flex items-center gap-4 mb-3">
          <Filter size={20} className="text-gray-400" />
          <span className="text-gray-300 font-medium">Filtros</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Severidade</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="w-full px-2 py-1 bg-cinza-escuro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
            >
              <option value="">Todas</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-2 py-1 bg-cinza-escuro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="new">Novo</option>
              <option value="investigating">Investigando</option>
              <option value="resolved">Resolvido</option>
              <option value="dismissed">Descartado</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Tipo</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-2 py-1 bg-cinza-escuro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="fraud_detection">Detecção de Fraude</option>
              <option value="suspicious_activity">Atividade Suspeita</option>
              <option value="system_anomaly">Anomalia do Sistema</option>
              <option value="compliance_violation">Violação de Compliance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => {
          const IconComponent = typeIcons[alert.type];
          return (
            <div
              key={alert.id}
              className={`bg-cinza-claro p-4 rounded-lg border-l-4 cursor-pointer hover:bg-cinza-medio transition-colors ${
                alert.severity === 'critical' ? 'border-vermelho' :
                alert.severity === 'high' ? 'border-amarelo' :
                alert.severity === 'medium' ? 'border-azul-ciano' : 'border-verde'
              }`}
              onClick={() => setSelectedAlert(alert)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <IconComponent size={20} className={
                    alert.severity === 'critical' ? 'text-vermelho' :
                    alert.severity === 'high' ? 'text-amarelo' :
                    'text-azul-ciano'
                  } />
                  <div>
                    <h3 className="font-semibold text-branco">{alert.title}</h3>
                    <p className="text-sm text-gray-400">{alert.affectedEntity} ({alert.entityType})</p>
                  </div>
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

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Criado em: {formatDate(alert.createdAt)}</span>
                {alert.assignedTo && (
                  <span>Atribuído a: {alert.assignedTo}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Detalhes do Alerta */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-cinza-escuro p-6 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-branco">
                Detalhes do Alerta - {selectedAlert.title}
              </h3>
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 bg-gray-600 text-branco rounded-md hover:bg-gray-600/80"
              >
                Fechar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-branco mb-3">Informações Gerais</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tipo:</span>
                    <span className="text-branco">{selectedAlert.type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Severidade:</span>
                    <span className={`font-medium ${
                      selectedAlert.severity === 'critical' ? 'text-vermelho' :
                      selectedAlert.severity === 'high' ? 'text-amarelo' :
                      selectedAlert.severity === 'medium' ? 'text-azul-ciano' : 'text-verde'
                    }`}>{selectedAlert.severity.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-branco">{selectedAlert.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Entidade Afetada:</span>
                    <span className="text-branco">{selectedAlert.affectedEntity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tipo de Entidade:</span>
                    <span className="text-branco">{selectedAlert.entityType}</span>
                  </div>
                  {selectedAlert.assignedTo && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Atribuído a:</span>
                      <span className="text-branco">{selectedAlert.assignedTo}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-branco mb-3">Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Criado em:</span>
                    <span className="text-branco">{formatDate(selectedAlert.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Atualizado em:</span>
                    <span className="text-branco">{formatDate(selectedAlert.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-branco mb-3">Descrição</h4>
              <p className="text-gray-300">{selectedAlert.description}</p>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-branco mb-3">Evidências</h4>
              <ul className="space-y-2">
                {selectedAlert.evidence.map((evidence, index) => (
                  <li key={index} className="text-gray-300 flex items-center">
                    <span className="w-2 h-2 bg-azul-ciano rounded-full mr-3"></span>
                    {evidence}
                  </li>
                ))}
              </ul>
            </div>

            {selectedAlert.resolution && (
              <div className="mb-6">
                <h4 className="font-medium text-branco mb-3">Resolução</h4>
                <p className="text-gray-300 bg-cinza-claro p-3 rounded">{selectedAlert.resolution}</p>
              </div>
            )}

            <div className="flex gap-3">
              {selectedAlert.status === 'new' && (
                <>
                  <button
                    onClick={() => updateAlertStatus(selectedAlert.id, 'investigating')}
                    className="px-4 py-2 bg-amarelo text-black rounded hover:bg-amarelo/80"
                  >
                    Iniciar Investigação
                  </button>
                  <button
                    onClick={() => updateAlertStatus(selectedAlert.id, 'dismissed')}
                    className="px-4 py-2 bg-gray-600 text-branco rounded hover:bg-gray-600/80"
                  >
                    Descartar
                  </button>
                </>
              )}
              {selectedAlert.status === 'investigating' && (
                <button
                  onClick={() => updateAlertStatus(selectedAlert.id, 'resolved')}
                  className="px-4 py-2 bg-verde text-branco rounded hover:bg-verde/80"
                >
                  <CheckCircle className="inline mr-2" size={16} />
                  Marcar como Resolvido
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityAlertsPage;

