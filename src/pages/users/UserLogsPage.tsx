import React, { useState } from 'react';
import { Activity, User, Calendar, Filter, Download, Eye, Search, Clock } from 'lucide-react';

interface UserLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  success: boolean;
}

const UserLogsPage: React.FC = () => {
  const [logs] = useState<UserLog[]>([
    {
      id: '1',
      userId: 'admin001',
      userName: 'João Silva',
      userEmail: 'joao.silva@fature.com',
      action: 'Criou novo afiliado',
      module: 'Gerenciamento de Afiliados',
      details: 'Criou afiliado "Carlos Mendes" com categoria Expert',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: '2025-06-02T10:30:00Z',
      severity: 'MEDIUM',
      success: true,
    },
    {
      id: '2',
      userId: 'admin002',
      userName: 'Maria Santos',
      userEmail: 'maria.santos@fature.com',
      action: 'Alterou configuração de comissão',
      module: 'Configurações',
      details: 'Modificou taxa de comissão da categoria Expert de 15% para 18%',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      timestamp: '2025-06-02T09:45:00Z',
      severity: 'HIGH',
      success: true,
    },
    {
      id: '3',
      userId: 'admin001',
      userName: 'João Silva',
      userEmail: 'joao.silva@fature.com',
      action: 'Tentativa de acesso negada',
      module: 'Segurança',
      details: 'Tentou acessar módulo de Auditoria sem permissão',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: '2025-06-02T08:15:00Z',
      severity: 'CRITICAL',
      success: false,
    },
    {
      id: '4',
      userId: 'admin003',
      userName: 'Pedro Costa',
      userEmail: 'pedro.costa@fature.com',
      action: 'Exportou relatório',
      module: 'Relatórios',
      details: 'Exportou relatório de comissões do período 01/05 a 31/05',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      timestamp: '2025-06-02T07:30:00Z',
      severity: 'LOW',
      success: true,
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<UserLog | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesUser = selectedUser === 'all' || log.userId === selectedUser;
    const matchesModule = selectedModule === 'all' || log.module === selectedModule;
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    const matchesSearch = searchTerm === '' || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesUser && matchesModule && matchesSeverity && matchesSearch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'text-green-400 bg-green-400/10';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/10';
      case 'HIGH': return 'text-orange-400 bg-orange-400/10';
      case 'CRITICAL': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const exportLogs = () => {
    const csvContent = [
      ['Data/Hora', 'Usuário', 'Email', 'Ação', 'Módulo', 'Detalhes', 'IP', 'Severidade', 'Sucesso'].join(','),
      ...filteredLogs.map(log => [
        formatTimestamp(log.timestamp),
        log.userName,
        log.userEmail,
        log.action,
        log.module,
        log.details,
        log.ipAddress,
        log.severity,
        log.success ? 'Sim' : 'Não'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueUsers = Array.from(new Set(logs.map(log => ({ id: log.userId, name: log.userName }))));
  const uniqueModules = Array.from(new Set(logs.map(log => log.module)));

  return (
    <div className="min-h-screen bg-background text-text p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Activity className="mr-3 text-[rgb(18,201,185)]" size={32} />
              📋 Logs de Usuários
            </h1>
            <p className="text-text-secondary mt-2">
              Acompanhe todas as ações realizadas pelos usuários do sistema
            </p>
          </div>
          <button
            onClick={exportLogs}
            className="bg-[rgb(18,201,185)] text-white px-6 py-3 rounded-lg hover:bg-[rgb(16,181,166)] transition-colors flex items-center"
          >
            <Download className="mr-2" size={20} />
            Exportar Logs
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-card p-6 rounded-lg border border-border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <User className="inline mr-1" size={16} />
                Usuário
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 bg-background text-white rounded border border-border focus:border-[rgb(18,201,185)] focus:outline-none"
              >
                <option value="all">Todos os usuários</option>
                {uniqueUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <Filter className="inline mr-1" size={16} />
                Módulo
              </label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full px-3 py-2 bg-background text-white rounded border border-border focus:border-[rgb(18,201,185)] focus:outline-none"
              >
                <option value="all">Todos os módulos</option>
                {uniqueModules.map(module => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <Calendar className="inline mr-1" size={16} />
                Severidade
              </label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full px-3 py-2 bg-background text-white rounded border border-border focus:border-[rgb(18,201,185)] focus:outline-none"
              >
                <option value="all">Todas as severidades</option>
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
                <option value="CRITICAL">Crítica</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <Search className="inline mr-1" size={16} />
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por ação, detalhes ou usuário..."
                className="w-full px-3 py-2 bg-background text-white rounded border border-border focus:border-[rgb(18,201,185)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[rgb(18,201,185)]">{filteredLogs.length}</div>
                <div className="text-sm text-text-secondary">Total de Logs</div>
              </div>
              <Activity className="text-[rgb(18,201,185)]" size={24} />
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">{filteredLogs.filter(log => log.success).length}</div>
                <div className="text-sm text-text-secondary">Ações Bem-sucedidas</div>
              </div>
              <Eye className="text-green-400" size={24} />
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-400">{filteredLogs.filter(log => !log.success).length}</div>
                <div className="text-sm text-text-secondary">Ações Falharam</div>
              </div>
              <Filter className="text-red-400" size={24} />
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-400">{uniqueUsers.length}</div>
                <div className="text-sm text-text-secondary">Usuários Ativos</div>
              </div>
              <User className="text-yellow-400" size={24} />
            </div>
          </div>
        </div>

        {/* Lista de Logs */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-white">Histórico de Ações</h2>
          </div>
          <div className="p-6">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="mx-auto text-text-secondary mb-4" size={48} />
                <h3 className="text-lg font-medium text-white mb-2">Nenhum log encontrado</h3>
                <p className="text-text-secondary">Ajuste os filtros para ver mais resultados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map(log => (
                  <div key={log.id} className="bg-background p-4 rounded-lg border border-border hover:border-[rgb(18,201,185)] transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(log.severity)}`}>
                            {log.severity}
                          </div>
                          <div className={`w-2 h-2 rounded-full ${log.success ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <div className="text-white font-medium">{log.userName}</div>
                          <div className="text-text-secondary text-sm">{log.userEmail}</div>
                        </div>
                        <div className="text-white font-medium mb-1">{log.action}</div>
                        <div className="text-text-secondary text-sm mb-2">{log.details}</div>
                        <div className="flex items-center gap-4 text-xs text-text-secondary">
                          <span className="flex items-center">
                            <Clock className="mr-1" size={12} />
                            {formatTimestamp(log.timestamp)}
                          </span>
                          <span>Módulo: {log.module}</span>
                          <span>IP: {log.ipAddress}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-2 bg-[rgb(18,201,185)] text-white rounded hover:bg-[rgb(16,181,166)] transition-colors"
                        title="Ver Detalhes"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal de Detalhes */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Detalhes do Log</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-text-secondary hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Usuário</label>
                    <div className="text-white">{selectedLog.userName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                    <div className="text-white">{selectedLog.userEmail}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Ação</label>
                  <div className="text-white">{selectedLog.action}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Detalhes</label>
                  <div className="text-white">{selectedLog.details}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Módulo</label>
                    <div className="text-white">{selectedLog.module}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Severidade</label>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSeverityColor(selectedLog.severity)}`}>
                      {selectedLog.severity}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">IP Address</label>
                    <div className="text-white">{selectedLog.ipAddress}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                    <div className={`text-${selectedLog.success ? 'green' : 'red'}-400`}>
                      {selectedLog.success ? 'Sucesso' : 'Falha'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Data/Hora</label>
                  <div className="text-white">{formatTimestamp(selectedLog.timestamp)}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">User Agent</label>
                  <div className="text-white text-sm break-all">{selectedLog.userAgent}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLogsPage;

