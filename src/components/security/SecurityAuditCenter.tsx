import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff,
  UserCheck,
  UserX,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Key,
  Database,
  FileText,
  Settings,
  Users,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failed' | 'warning';
}

interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  active: boolean;
  createdAt: Date;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  actions: string[];
}

interface SecurityAlert {
  id: string;
  type: 'login_attempt' | 'permission_escalation' | 'data_access' | 'system_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  user: string;
  timestamp: Date;
  resolved: boolean;
  details: any;
}

interface BackupStatus {
  id: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  startTime: Date;
  endTime?: Date;
  size: number;
  location: string;
  retention: number;
}

const SecurityAuditCenter: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [backupStatus, setBackupStatus] = useState<BackupStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('audit');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);

  // Estados para formulários
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    active: true
  });

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setIsLoading(true);
    
    // Simular carregamento de dados de segurança
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Logs de auditoria
    const logs: AuditLog[] = [
      {
        id: 'log_001',
        timestamp: new Date(Date.now() - 300000),
        user: 'admin@fature.com',
        action: 'LOGIN',
        resource: 'Sistema',
        details: 'Login realizado com sucesso',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        severity: 'low',
        status: 'success'
      },
      {
        id: 'log_002',
        timestamp: new Date(Date.now() - 600000),
        user: 'operator@fature.com',
        action: 'UPDATE_CONFIG',
        resource: 'Configurações CPA',
        details: 'Alteração no valor mínimo de depósito: R$30 → R$50',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        severity: 'medium',
        status: 'success'
      },
      {
        id: 'log_003',
        timestamp: new Date(Date.now() - 900000),
        user: 'unknown',
        action: 'FAILED_LOGIN',
        resource: 'Sistema',
        details: 'Tentativa de login falhada - credenciais inválidas',
        ipAddress: '203.0.113.45',
        userAgent: 'curl/7.68.0',
        severity: 'high',
        status: 'failed'
      },
      {
        id: 'log_004',
        timestamp: new Date(Date.now() - 1200000),
        user: 'admin@fature.com',
        action: 'CREATE_USER',
        resource: 'Usuários',
        details: 'Novo usuário criado: manager@fature.com',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        severity: 'medium',
        status: 'success'
      },
      {
        id: 'log_005',
        timestamp: new Date(Date.now() - 1800000),
        user: 'system',
        action: 'BACKUP_COMPLETED',
        resource: 'Database',
        details: 'Backup automático concluído com sucesso',
        ipAddress: 'localhost',
        userAgent: 'System Process',
        severity: 'low',
        status: 'success'
      }
    ];

    // Roles de usuário
    const roles: UserRole[] = [
      {
        id: 'role_admin',
        name: 'Administrador',
        description: 'Acesso completo ao sistema',
        permissions: ['*'],
        userCount: 2,
        active: true,
        createdAt: new Date(Date.now() - 86400000 * 30)
      },
      {
        id: 'role_manager',
        name: 'Gerente',
        description: 'Acesso a relatórios e configurações',
        permissions: ['read_reports', 'update_configs', 'manage_users'],
        userCount: 5,
        active: true,
        createdAt: new Date(Date.now() - 86400000 * 20)
      },
      {
        id: 'role_operator',
        name: 'Operador',
        description: 'Acesso limitado a operações básicas',
        permissions: ['read_dashboard', 'update_basic_configs'],
        userCount: 12,
        active: true,
        createdAt: new Date(Date.now() - 86400000 * 15)
      },
      {
        id: 'role_viewer',
        name: 'Visualizador',
        description: 'Apenas leitura de dashboards',
        permissions: ['read_dashboard', 'read_reports'],
        userCount: 8,
        active: true,
        createdAt: new Date(Date.now() - 86400000 * 10)
      }
    ];

    // Permissões disponíveis
    const perms: Permission[] = [
      {
        id: 'perm_001',
        name: 'read_dashboard',
        description: 'Visualizar dashboard principal',
        category: 'Dashboard',
        resource: 'dashboard',
        actions: ['read']
      },
      {
        id: 'perm_002',
        name: 'read_reports',
        description: 'Visualizar relatórios',
        category: 'Relatórios',
        resource: 'reports',
        actions: ['read']
      },
      {
        id: 'perm_003',
        name: 'update_configs',
        description: 'Atualizar configurações',
        category: 'Configurações',
        resource: 'configurations',
        actions: ['read', 'update']
      },
      {
        id: 'perm_004',
        name: 'manage_users',
        description: 'Gerenciar usuários',
        category: 'Usuários',
        resource: 'users',
        actions: ['read', 'create', 'update', 'delete']
      },
      {
        id: 'perm_005',
        name: 'update_basic_configs',
        description: 'Atualizar configurações básicas',
        category: 'Configurações',
        resource: 'basic_configurations',
        actions: ['read', 'update']
      }
    ];

    // Alertas de segurança
    const alerts: SecurityAlert[] = [
      {
        id: 'alert_001',
        type: 'login_attempt',
        severity: 'high',
        message: 'Múltiplas tentativas de login falhadas detectadas',
        user: 'unknown',
        timestamp: new Date(Date.now() - 900000),
        resolved: false,
        details: { attempts: 5, ipAddress: '203.0.113.45' }
      },
      {
        id: 'alert_002',
        type: 'permission_escalation',
        severity: 'critical',
        message: 'Tentativa de escalação de privilégios detectada',
        user: 'operator@fature.com',
        timestamp: new Date(Date.now() - 1800000),
        resolved: true,
        details: { attemptedPermission: 'admin_access' }
      },
      {
        id: 'alert_003',
        type: 'data_access',
        severity: 'medium',
        message: 'Acesso a dados sensíveis fora do horário comercial',
        user: 'manager@fature.com',
        timestamp: new Date(Date.now() - 3600000),
        resolved: false,
        details: { resource: 'financial_reports', time: '02:30 AM' }
      }
    ];

    // Status de backup
    const backups: BackupStatus[] = [
      {
        id: 'backup_001',
        type: 'full',
        status: 'completed',
        startTime: new Date(Date.now() - 7200000),
        endTime: new Date(Date.now() - 5400000),
        size: 2.5,
        location: 's3://fature-backups/full/2024-12-15',
        retention: 30
      },
      {
        id: 'backup_002',
        type: 'incremental',
        status: 'running',
        startTime: new Date(Date.now() - 1800000),
        size: 0.3,
        location: 's3://fature-backups/incremental/2024-12-15',
        retention: 7
      },
      {
        id: 'backup_003',
        type: 'differential',
        status: 'scheduled',
        startTime: new Date(Date.now() + 3600000),
        size: 0,
        location: 's3://fature-backups/differential/2024-12-15',
        retention: 14
      }
    ];

    setAuditLogs(logs);
    setUserRoles(roles);
    setPermissions(perms);
    setSecurityAlerts(alerts);
    setBackupStatus(backups);
    setIsLoading(false);
  };

  const handleSaveRole = () => {
    const newRole: UserRole = {
      id: editingRole?.id || `role_${Date.now()}`,
      name: roleForm.name,
      description: roleForm.description,
      permissions: roleForm.permissions,
      userCount: editingRole?.userCount || 0,
      active: roleForm.active,
      createdAt: editingRole?.createdAt || new Date()
    };

    if (editingRole) {
      setUserRoles(prev => prev.map(role => role.id === editingRole.id ? newRole : role));
      toast.success('Role atualizada com sucesso');
    } else {
      setUserRoles(prev => [...prev, newRole]);
      toast.success('Nova role criada com sucesso');
    }

    setIsRoleDialogOpen(false);
    setEditingRole(null);
    resetRoleForm();
  };

  const resetRoleForm = () => {
    setRoleForm({
      name: '',
      description: '',
      permissions: [],
      active: true
    });
  };

  const editRole = (role: UserRole) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      active: role.active
    });
    setIsRoleDialogOpen(true);
  };

  const deleteRole = (id: string) => {
    setUserRoles(prev => prev.filter(role => role.id !== id));
    toast.success('Role removida com sucesso');
  };

  const resolveAlert = (id: string) => {
    setSecurityAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
    toast.success('Alerta resolvido');
  };

  const startBackup = (type: 'full' | 'incremental' | 'differential') => {
    const newBackup: BackupStatus = {
      id: `backup_${Date.now()}`,
      type,
      status: 'running',
      startTime: new Date(),
      size: 0,
      location: `s3://fature-backups/${type}/${new Date().toISOString().split('T')[0]}`,
      retention: type === 'full' ? 30 : type === 'differential' ? 14 : 7
    };

    setBackupStatus(prev => [...prev, newBackup]);
    toast.success(`Backup ${type} iniciado`);
  };

  const exportAuditLog = () => {
    toast.success('Log de auditoria exportado com sucesso');
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-600">Crítico</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">Alto</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Médio</Badge>;
      case 'low':
        return <Badge className="bg-blue-500">Baixo</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Sucesso</Badge>;
      case 'failed':
        return <Badge className="bg-red-500"><AlertTriangle className="h-3 w-3 mr-1" />Falha</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500"><AlertTriangle className="h-3 w-3 mr-1" />Aviso</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getBackupStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Concluído</Badge>;
      case 'running':
        return <Badge className="bg-blue-500">Executando</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Falhou</Badge>;
      case 'scheduled':
        return <Badge className="bg-gray-500">Agendado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Centro de Segurança e Auditoria</h2>
          <p className="text-muted-foreground">
            Monitoramento, controle de acesso e auditoria completa do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsRoleDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Role
          </Button>
          <Button 
            onClick={exportAuditLog}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar Logs
          </Button>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logs Hoje</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              {auditLogs.filter(l => l.status === 'success').length} sucessos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {securityAlerts.filter(a => !a.resolved).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRoles.filter(r => r.active).length}</div>
            <p className="text-xs text-muted-foreground">
              De {userRoles.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Backup</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">2h</div>
            <p className="text-xs text-muted-foreground">
              Backup completo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Auditoria
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles & Permissões
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alertas
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoramento
          </TabsTrigger>
        </TabsList>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Logs de Auditoria</CardTitle>
                  <CardDescription>
                    Registro completo de todas as ações no sistema
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <Input
                      placeholder="Buscar logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-48"
                    />
                  </div>
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="critical">Crítico</SelectItem>
                      <SelectItem value="high">Alto</SelectItem>
                      <SelectItem value="medium">Médio</SelectItem>
                      <SelectItem value="low">Baixo</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="success">Sucesso</SelectItem>
                      <SelectItem value="failed">Falha</SelectItem>
                      <SelectItem value="warning">Aviso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Recurso</TableHead>
                    <TableHead>Detalhes</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Severidade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {log.timestamp.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell>{log.resource}</TableCell>
                      <TableCell className="max-w-xs truncate" title={log.details}>
                        {log.details}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Roles e Permissões</CardTitle>
              <CardDescription>
                Configure roles de usuário e suas permissões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Permissões</TableHead>
                    <TableHead>Usuários</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((perm, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {perm === '*' ? 'Todas' : perm}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{role.userCount}</TableCell>
                      <TableCell>
                        {role.active ? (
                          <Badge className="bg-green-500">Ativa</Badge>
                        ) : (
                          <Badge variant="destructive">Inativa</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {role.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => editRole(role)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remover Role</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja remover a role "{role.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteRole(role.id)}>
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Segurança</CardTitle>
              <CardDescription>
                Monitoramento de eventos de segurança em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Severidade</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {alert.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                      <TableCell className="max-w-xs">{alert.message}</TableCell>
                      <TableCell className="font-medium">{alert.user}</TableCell>
                      <TableCell className="text-sm">
                        {alert.timestamp.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {alert.resolved ? (
                          <Badge className="bg-green-500">Resolvido</Badge>
                        ) : (
                          <Badge className="bg-red-500">Ativo</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {!alert.resolved && (
                          <Button 
                            size="sm" 
                            onClick={() => resolveAlert(alert.id)}
                          >
                            Resolver
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup Completo
                </CardTitle>
                <CardDescription>
                  Backup completo de todos os dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => startBackup('full')}
                  className="w-full"
                >
                  Iniciar Backup Completo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup Incremental
                </CardTitle>
                <CardDescription>
                  Backup apenas das alterações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => startBackup('incremental')}
                  variant="outline"
                  className="w-full"
                >
                  Iniciar Incremental
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup Diferencial
                </CardTitle>
                <CardDescription>
                  Backup das mudanças desde o último completo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => startBackup('differential')}
                  variant="outline"
                  className="w-full"
                >
                  Iniciar Diferencial
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Status dos Backups</CardTitle>
              <CardDescription>
                Histórico e status dos backups realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Fim</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Retenção</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backupStatus.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {backup.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{getBackupStatusBadge(backup.status)}</TableCell>
                      <TableCell className="text-sm">
                        {backup.startTime.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {backup.endTime?.toLocaleString() || '-'}
                      </TableCell>
                      <TableCell>{backup.size.toFixed(1)} GB</TableCell>
                      <TableCell className="font-mono text-xs max-w-xs truncate">
                        {backup.location}
                      </TableCell>
                      <TableCell>{backup.retention} dias</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monitoramento em Tempo Real</CardTitle>
                <CardDescription>
                  Status dos sistemas críticos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Sistema Principal</span>
                  <Badge className="bg-green-500">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Base de Dados</span>
                  <Badge className="bg-green-500">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cache Redis</span>
                  <Badge className="bg-green-500">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>API Gateway</span>
                  <Badge className="bg-green-500">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Serviços Externos</span>
                  <Badge className="bg-yellow-500">Degradado</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Segurança</CardTitle>
                <CardDescription>
                  Indicadores de segurança do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Tentativas de Login Falhadas (24h)</span>
                  <span className="font-bold text-red-600">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sessões Ativas</span>
                  <span className="font-bold">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>IPs Bloqueados</span>
                  <span className="font-bold text-orange-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Certificados SSL</span>
                  <Badge className="bg-green-500">Válidos</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Última Verificação</span>
                  <span className="text-sm text-muted-foreground">2 min atrás</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? 'Editar Role' : 'Nova Role de Usuário'}
            </DialogTitle>
            <DialogDescription>
              Configure as permissões e propriedades da role
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role-name">Nome da Role</Label>
                <Input
                  id="role-name"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  placeholder="Ex: Gerente de Operações"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="role-active"
                  checked={roleForm.active}
                  onCheckedChange={(checked) => setRoleForm({ ...roleForm, active: checked })}
                />
                <Label htmlFor="role-active">Role Ativa</Label>
              </div>
            </div>
            
            <div>
              <Label htmlFor="role-description">Descrição</Label>
              <Input
                id="role-description"
                value={roleForm.description}
                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                placeholder="Descrição da role e suas responsabilidades"
              />
            </div>

            <div>
              <Label>Permissões</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={permission.id}
                      checked={roleForm.permissions.includes(permission.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRoleForm({
                            ...roleForm,
                            permissions: [...roleForm.permissions, permission.name]
                          });
                        } else {
                          setRoleForm({
                            ...roleForm,
                            permissions: roleForm.permissions.filter(p => p !== permission.name)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={permission.id} className="text-sm">
                      {permission.description}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveRole}>
              <Key className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecurityAuditCenter;

