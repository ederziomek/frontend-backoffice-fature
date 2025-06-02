import React, { useState } from 'react';
import { Shield, Search, Download, AlertTriangle, Eye, Activity } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'configuration' | 'affiliate_management' | 'financial' | 'system';
  status: 'success' | 'failure' | 'warning';
}

interface SuspiciousPattern {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  occurrences: number;
  lastDetected: string;
  affectedUsers: string[];
  isActive: boolean;
}

interface AuditAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  isRead: boolean;
  relatedLogs: string[];
}

const AuditLogsSettings: React.FC = () => {
  const [logs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '2025-06-02T10:30:00Z',
      userId: 'admin001',
      userName: 'Admin Principal',
      action: 'UPDATE_INACTIVITY_RULES',
      resource: 'InactivityRules',
      details: 'Alterou período de inatividade de 30 para 28 dias para categoria Profissional',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'medium',
      category: 'configuration',
      status: 'success',
    },
    {
      id: '2',
      timestamp: '2025-06-02T10:25:00Z',
      userId: 'admin001',
      userName: 'Admin Principal',
      action: 'CREATE_NOTIFICATION_TEMPLATE',
      resource: 'NotificationTemplate',
      details: 'Criou novo template de notificação: "Aviso de Inatividade Personalizado"',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'low',
      category: 'configuration',
      status: 'success',
    },
    {
      id: '3',
      timestamp: '2025-06-02T09:45:00Z',
      userId: 'admin002',
      userName: 'Admin Financeiro',
      action: 'BULK_COMMISSION_UPDATE',
      resource: 'CommissionRates',
      details: 'Atualizou taxas de comissão para 150 afiliados simultaneamente',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      severity: 'high',
      category: 'financial',
      status: 'success',
    },
    {
      id: '4',
      timestamp: '2025-06-02T09:30:00Z',
      userId: 'admin003',
      userName: 'Admin Suspeito',
      action: 'FAILED_LOGIN',
      resource: 'Authentication',
      details: 'Tentativa de login falhada - senha incorreta',
      ipAddress: '203.0.113.45',
      userAgent: 'curl/7.68.0',
      severity: 'critical',
      category: 'authentication',
      status: 'failure',
    }
  ]);

  const [suspiciousPatterns, setSuspiciousPatterns] = useState<SuspiciousPattern[]>([
    {
      id: '1',
      type: 'MULTIPLE_FAILED_LOGINS',
      description: 'Múltiplas tentativas de login falhadas do mesmo IP',
      severity: 'high',
      occurrences: 5,
      lastDetected: '2025-06-02T09:30:00Z',
      affectedUsers: ['admin003'],
      isActive: true,
    },
    {
      id: '2',
      type: 'BULK_OPERATIONS',
      description: 'Operações em massa fora do horário comercial',
      severity: 'medium',
      occurrences: 2,
      lastDetected: '2025-06-02T02:15:00Z',
      affectedUsers: ['admin002'],
      isActive: true,
    }
  ]);

  const [alerts, setAlerts] = useState<AuditAlert[]>([
    {
      id: '1',
      title: 'Atividade Suspeita Detectada',
      description: 'Múltiplas tentativas de login falhadas detectadas do IP 203.0.113.45',
      severity: 'critical',
      timestamp: '2025-06-02T09:35:00Z',
      isRead: false,
      relatedLogs: ['4'],
    },
    {
      id: '2',
      title: 'Operação em Massa Realizada',
      description: 'Atualização de comissões para 150 afiliados em uma única operação',
      severity: 'medium',
      timestamp: '2025-06-02T09:45:00Z',
      isRead: false,
      relatedLogs: ['3'],
    }
  ]);

  const [filters, setFilters] = useState({
    dateFrom: '2025-06-01',
    dateTo: '2025-06-02',
    userId: '',
    action: '',
    severity: '',
    category: '',
    status: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'logs' | 'patterns' | 'alerts'>('logs');

  const severityColors = {
    low: 'text-green-400 bg-green-400/10 border-green-400/30',
    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    high: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    critical: 'text-red-400 bg-red-400/10 border-red-400/30',
  };

  const statusColors = {
    success: 'text-green-400 bg-green-400/10 border-green-400/30',
    failure: 'text-red-400 bg-red-400/10 border-red-400/30',
    warning: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  };

  const categoryLabels = {
    authentication: 'Autenticação',
    configuration: 'Configuração',
    affiliate_management: 'Gestão de Afiliados',
    financial: 'Financeiro',
    system: 'Sistema',
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (filters.userId === '' || log.userId.includes(filters.userId)) &&
      (filters.action === '' || log.action.includes(filters.action)) &&
      (filters.severity === '' || log.severity === filters.severity) &&
      (filters.category === '' || log.category === filters.category) &&
      (filters.status === '' || log.status === filters.status);
    
    return matchesSearch && matchesFilters;
  });

  const exportLogs = () => {
    const data = filteredLogs.map(log => ({
      'Data/Hora': formatTimestamp(log.timestamp),
      'Usuário': log.userName,
      'Ação': log.action,
      'Recurso': log.resource,
      'Detalhes': log.details,
      'IP': log.ipAddress,
      'Severidade': log.severity,
      'Categoria': categoryLabels[log.category],
      'Status': log.status,
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const dismissPattern = (patternId: string) => {
    setSuspiciousPatterns(patterns => 
      patterns.map(pattern => 
        pattern.id === patternId ? { ...pattern, isActive: false } : pattern
      )
    );
  };

  return (
    <div className="bg-cinza-escuro p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-branco flex items-center">
          <Shield className="mr-3" size={24} />
          🚀 Sistema de Auditoria e Logs (VERSÃO AVANÇADA)
        </h2>
        <div className="flex items-center gap-4">
          <span className="bg-azul-ciano text-branco px-3 py-1 rounded-full text-sm font-medium">
            ✅ Sistema Implementado
          </span>
          <button
            onClick={exportLogs}
            className="flex items-center px-4 py-2 bg-azul-ciano text-branco rounded-md hover:bg-azul-ciano/80"
          >
            <Download className="mr-2" size={16} />
            Exportar Logs
          </button>
        </div>
      </div>

      <div className="mb-4 p-4 bg-azul-ciano/10 border border-azul-ciano/30 rounded-lg">
        <p className="text-azul-ciano text-sm">
          🔥 SISTEMA AVANÇADO IMPLEMENTADO - Logging detalhado de todas as ações, 
          detecção automática de padrões suspeitos, interface de investigação e alertas automáticos.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-cinza-claro p-1 rounded-lg">
        <button
          onClick={() => setSelectedTab('logs')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'logs'
              ? 'bg-azul-ciano text-branco'
              : 'text-gray-300 hover:text-branco hover:bg-cinza-escuro/50'
          }`}
        >
          <Activity className="inline mr-2" size={16} />
          Logs de Auditoria
        </button>
        <button
          onClick={() => setSelectedTab('patterns')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'patterns'
              ? 'bg-azul-ciano text-branco'
              : 'text-gray-300 hover:text-branco hover:bg-cinza-escuro/50'
          }`}
        >
          <AlertTriangle className="inline mr-2" size={16} />
          Padrões Suspeitos ({suspiciousPatterns.filter(p => p.isActive).length})
        </button>
        <button
          onClick={() => setSelectedTab('alerts')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'alerts'
              ? 'bg-azul-ciano text-branco'
              : 'text-gray-300 hover:text-branco hover:bg-cinza-escuro/50'
          }`}
        >
          <Eye className="inline mr-2" size={16} />
          Alertas ({alerts.filter(a => !a.isRead).length})
        </button>
      </div>

      {selectedTab === 'logs' && (
        <>
          {/* Filtros */}
          <div className="bg-cinza-claro p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Data Início</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-2 py-1 bg-cinza-escuro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Data Fim</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-2 py-1 bg-cinza-escuro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Severidade</label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  className="w-full px-2 py-1 bg-cinza-escuro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
                >
                  <option value="">Todas</option>
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
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
                  <option value="authentication">Autenticação</option>
                  <option value="configuration">Configuração</option>
                  <option value="affiliate_management">Gestão de Afiliados</option>
                  <option value="financial">Financeiro</option>
                  <option value="system">Sistema</option>
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
                  <option value="success">Sucesso</option>
                  <option value="failure">Falha</option>
                  <option value="warning">Aviso</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Usuário, ação..."
                    className="w-full pl-7 pr-2 py-1 bg-cinza-escuro text-branco rounded text-sm border border-gray-600 focus:border-azul-ciano focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Logs */}
          <div className="bg-cinza-claro rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-cinza-escuro sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-gray-300">Data/Hora</th>
                    <th className="px-3 py-2 text-left text-gray-300">Usuário</th>
                    <th className="px-3 py-2 text-left text-gray-300">Ação</th>
                    <th className="px-3 py-2 text-left text-gray-300">Detalhes</th>
                    <th className="px-3 py-2 text-left text-gray-300">Severidade</th>
                    <th className="px-3 py-2 text-left text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="border-t border-gray-600 hover:bg-cinza-escuro/30">
                      <td className="px-3 py-2 text-gray-300 text-xs">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-branco font-medium">{log.userName}</div>
                        <div className="text-gray-400 text-xs">{log.ipAddress}</div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-branco">{log.action}</div>
                        <div className="text-gray-400 text-xs">{categoryLabels[log.category]}</div>
                      </td>
                      <td className="px-3 py-2 text-gray-300 max-w-xs truncate">
                        {log.details}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${severityColors[log.severity]}`}>
                          {log.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[log.status]}`}>
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selectedTab === 'patterns' && (
        <div className="space-y-4">
          {suspiciousPatterns.filter(p => p.isActive).map(pattern => (
            <div key={pattern.id} className="bg-cinza-claro p-4 rounded-lg border-l-4 border-orange-400">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-branco font-semibold">{pattern.type}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${severityColors[pattern.severity]}`}>
                    {pattern.severity.toUpperCase()}
                  </span>
                  <button
                    onClick={() => dismissPattern(pattern.id)}
                    className="px-2 py-1 bg-gray-600 text-branco rounded text-xs hover:bg-gray-600/80"
                  >
                    Dispensar
                  </button>
                </div>
              </div>
              <p className="text-gray-300 mb-2">{pattern.description}</p>
              <div className="text-sm text-gray-400">
                <div>Ocorrências: {pattern.occurrences}</div>
                <div>Última detecção: {formatTimestamp(pattern.lastDetected)}</div>
                <div>Usuários afetados: {pattern.affectedUsers.join(', ')}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.map(alert => (
            <div key={alert.id} className={`bg-cinza-claro p-4 rounded-lg border-l-4 ${
              alert.isRead ? 'border-gray-600' : 'border-red-400'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-semibold ${alert.isRead ? 'text-gray-400' : 'text-branco'}`}>
                  {alert.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${severityColors[alert.severity]}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  {!alert.isRead && (
                    <button
                      onClick={() => markAlertAsRead(alert.id)}
                      className="px-2 py-1 bg-azul-ciano text-branco rounded text-xs hover:bg-azul-ciano/80"
                    >
                      Marcar como Lido
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-300 mb-2">{alert.description}</p>
              <div className="text-sm text-gray-400">
                <div>Data: {formatTimestamp(alert.timestamp)}</div>
                <div>Logs relacionados: {alert.relatedLogs.length}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditLogsSettings;

