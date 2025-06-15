import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Activity, 
  Database, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Settings,
  Brain,
  Shield,
  Clock,
  TrendingUp,
  TrendingDown,
  Server,
  Wifi,
  WifiOff,
  Play,
  Pause,
  RotateCcw,
  Bell,
  BellRing
} from 'lucide-react';
import { toast } from 'sonner';

interface ServiceEndpoint {
  id: string;
  service: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  responseTime: number;
  lastCheck: Date;
  errorCount: number;
  successRate: number;
}

interface ServiceMetrics {
  service: string;
  uptime: number;
  totalRequests: number;
  avgResponseTime: number;
  errorRate: number;
  cacheHitRate: number;
  lastRestart: Date;
}

interface NotificationRule {
  id: string;
  name: string;
  service: string;
  condition: 'response_time' | 'error_rate' | 'uptime' | 'custom';
  threshold: number;
  operator: '>' | '<' | '=' | '>=';
  action: 'email' | 'webhook' | 'sms';
  active: boolean;
  lastTriggered?: Date;
}

interface CacheStatus {
  service: string;
  type: 'redis' | 'memory' | 'database';
  hitRate: number;
  missRate: number;
  totalKeys: number;
  memoryUsage: number;
  ttl: number;
}

const CompleteIntegrationDashboard: React.FC = () => {
  const [endpoints, setEndpoints] = useState<ServiceEndpoint[]>([]);
  const [metrics, setMetrics] = useState<ServiceMetrics[]>([]);
  const [notifications, setNotifications] = useState<NotificationRule[]>([]);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('endpoints');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

  // Dados simulados completos baseados na análise
  useEffect(() => {
    loadCompleteData();
    
    if (autoRefresh) {
      const interval = setInterval(loadCompleteData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const loadCompleteData = async () => {
    setIsLoading(true);
    
    // Simular carregamento de dados completos
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Endpoints completos dos 3 serviços
    const completeEndpoints: ServiceEndpoint[] = [
      // Config-Service (localhost:5000)
      {
        id: 'config_health',
        service: 'Config-Service',
        endpoint: '/health',
        method: 'GET',
        description: 'Health check do serviço de configurações',
        status: 'healthy',
        responseTime: 45,
        lastCheck: new Date(),
        errorCount: 0,
        successRate: 99.8
      },
      {
        id: 'config_get_all',
        service: 'Config-Service',
        endpoint: '/api/v1/config-service/configurations',
        method: 'GET',
        description: 'Listar todas as configurações',
        status: 'healthy',
        responseTime: 120,
        lastCheck: new Date(),
        errorCount: 2,
        successRate: 98.5
      },
      {
        id: 'config_get_by_key',
        service: 'Config-Service',
        endpoint: '/api/v1/config-service/configurations/:key',
        method: 'GET',
        description: 'Buscar configuração por chave',
        status: 'healthy',
        responseTime: 80,
        lastCheck: new Date(),
        errorCount: 1,
        successRate: 99.2
      },
      {
        id: 'config_create',
        service: 'Config-Service',
        endpoint: '/api/v1/config-service/configurations',
        method: 'POST',
        description: 'Criar nova configuração',
        status: 'healthy',
        responseTime: 150,
        lastCheck: new Date(),
        errorCount: 0,
        successRate: 100
      },
      {
        id: 'config_update',
        service: 'Config-Service',
        endpoint: '/api/v1/config-service/configurations/:key',
        method: 'PUT',
        description: 'Atualizar configuração existente',
        status: 'healthy',
        responseTime: 180,
        lastCheck: new Date(),
        errorCount: 3,
        successRate: 97.8
      },
      {
        id: 'config_delete',
        service: 'Config-Service',
        endpoint: '/api/v1/config-service/configurations/:key',
        method: 'DELETE',
        description: 'Deletar configuração',
        status: 'healthy',
        responseTime: 95,
        lastCheck: new Date(),
        errorCount: 0,
        successRate: 100
      },
      {
        id: 'config_propagate',
        service: 'Config-Service',
        endpoint: '/api/v1/config-service/propagate',
        method: 'POST',
        description: 'Propagar configurações via Redis Pub/Sub',
        status: 'healthy',
        responseTime: 250,
        lastCheck: new Date(),
        errorCount: 1,
        successRate: 99.5
      },

      // Integration-Service (localhost:3000)
      {
        id: 'integration_health',
        service: 'Integration-Service',
        endpoint: '/health',
        method: 'GET',
        description: 'Health check do motor CPA',
        status: 'healthy',
        responseTime: 35,
        lastCheck: new Date(),
        errorCount: 0,
        successRate: 100
      },
      {
        id: 'integration_validate_cpa',
        service: 'Integration-Service',
        endpoint: '/api/v1/integration-service/validate-cpa',
        method: 'POST',
        description: 'Validação CPA com motor de regras',
        status: 'healthy',
        responseTime: 320,
        lastCheck: new Date(),
        errorCount: 5,
        successRate: 96.8
      },
      {
        id: 'integration_cpa_rules',
        service: 'Integration-Service',
        endpoint: '/api/v1/integration-service/cpa-rules',
        method: 'GET',
        description: 'Consultar regras CPA ativas',
        status: 'healthy',
        responseTime: 90,
        lastCheck: new Date(),
        errorCount: 0,
        successRate: 100
      },
      {
        id: 'integration_test_cpa',
        service: 'Integration-Service',
        endpoint: '/api/v1/integration-service/test-cpa',
        method: 'POST',
        description: 'Testes automatizados CPA',
        status: 'healthy',
        responseTime: 450,
        lastCheck: new Date(),
        errorCount: 2,
        successRate: 98.9
      },
      {
        id: 'integration_fraud_check',
        service: 'Integration-Service',
        endpoint: '/api/v1/integration-service/fraud-detection',
        method: 'POST',
        description: 'Sistema de detecção de fraude',
        status: 'healthy',
        responseTime: 280,
        lastCheck: new Date(),
        errorCount: 1,
        successRate: 99.7
      },

      // Gamification-Service (localhost:3001)
      {
        id: 'gamification_health',
        service: 'Gamification-Service',
        endpoint: '/health',
        method: 'GET',
        description: 'Health check do serviço de gamificação',
        status: 'healthy',
        responseTime: 40,
        lastCheck: new Date(),
        errorCount: 0,
        successRate: 100
      },
      {
        id: 'gamification_analyze',
        service: 'Gamification-Service',
        endpoint: '/api/v1/gamification-service/analyze-behavior',
        method: 'POST',
        description: 'Análise comportamental com IA',
        status: 'healthy',
        responseTime: 850,
        lastCheck: new Date(),
        errorCount: 3,
        successRate: 97.2
      },
      {
        id: 'gamification_optimize',
        service: 'Gamification-Service',
        endpoint: '/api/v1/gamification-service/optimize-chest',
        method: 'POST',
        description: 'Otimização de baús por IA',
        status: 'healthy',
        responseTime: 650,
        lastCheck: new Date(),
        errorCount: 1,
        successRate: 99.1
      }
    ];

    // Métricas dos serviços
    const serviceMetrics: ServiceMetrics[] = [
      {
        service: 'Config-Service',
        uptime: 99.8,
        totalRequests: 15420,
        avgResponseTime: 125,
        errorRate: 1.2,
        cacheHitRate: 89.5,
        lastRestart: new Date(Date.now() - 86400000 * 3)
      },
      {
        service: 'Integration-Service',
        uptime: 99.5,
        totalRequests: 8950,
        avgResponseTime: 285,
        errorRate: 2.8,
        cacheHitRate: 92.3,
        lastRestart: new Date(Date.now() - 86400000 * 1)
      },
      {
        service: 'Gamification-Service',
        uptime: 99.9,
        totalRequests: 5680,
        avgResponseTime: 750,
        errorRate: 1.5,
        cacheHitRate: 85.7,
        lastRestart: new Date(Date.now() - 86400000 * 7)
      }
    ];

    // Regras de notificação
    const notificationRules: NotificationRule[] = [
      {
        id: 'response_time_alert',
        name: 'Tempo de Resposta Alto',
        service: 'all',
        condition: 'response_time',
        threshold: 1000,
        operator: '>',
        action: 'email',
        active: true,
        lastTriggered: new Date(Date.now() - 3600000 * 2)
      },
      {
        id: 'error_rate_alert',
        name: 'Taxa de Erro Elevada',
        service: 'Integration-Service',
        condition: 'error_rate',
        threshold: 5,
        operator: '>',
        action: 'webhook',
        active: true
      },
      {
        id: 'uptime_alert',
        name: 'Uptime Baixo',
        service: 'all',
        condition: 'uptime',
        threshold: 99,
        operator: '<',
        action: 'sms',
        active: true
      }
    ];

    // Status do cache
    const cacheStatuses: CacheStatus[] = [
      {
        service: 'Config-Service',
        type: 'redis',
        hitRate: 89.5,
        missRate: 10.5,
        totalKeys: 1250,
        memoryUsage: 45.8,
        ttl: 300
      },
      {
        service: 'Integration-Service',
        type: 'redis',
        hitRate: 92.3,
        missRate: 7.7,
        totalKeys: 890,
        memoryUsage: 32.1,
        ttl: 600
      },
      {
        service: 'Gamification-Service',
        type: 'memory',
        hitRate: 85.7,
        missRate: 14.3,
        totalKeys: 450,
        memoryUsage: 28.9,
        ttl: 1800
      }
    ];

    setEndpoints(completeEndpoints);
    setMetrics(serviceMetrics);
    setNotifications(notificationRules);
    setCacheStatus(cacheStatuses);
    setIsLoading(false);
  };

  const testEndpoint = async (endpoint: ServiceEndpoint) => {
    setIsLoading(true);
    try {
      // Simular teste do endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar status do endpoint
      setEndpoints(prev => prev.map(ep => 
        ep.id === endpoint.id 
          ? { ...ep, status: 'healthy', lastCheck: new Date(), responseTime: Math.random() * 500 + 50 }
          : ep
      ));
      
      toast.success(`Endpoint ${endpoint.endpoint} testado com sucesso`);
    } catch (error) {
      toast.error(`Erro ao testar endpoint ${endpoint.endpoint}`);
    } finally {
      setIsLoading(false);
    }
  };

  const restartService = async (serviceName: string) => {
    setIsLoading(true);
    try {
      // Simular restart do serviço
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Atualizar métricas
      setMetrics(prev => prev.map(metric => 
        metric.service === serviceName 
          ? { ...metric, lastRestart: new Date(), uptime: 100 }
          : metric
      ));
      
      toast.success(`Serviço ${serviceName} reiniciado com sucesso`);
    } catch (error) {
      toast.error(`Erro ao reiniciar serviço ${serviceName}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = async (serviceName: string) => {
    try {
      // Simular limpeza de cache
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCacheStatus(prev => prev.map(cache => 
        cache.service === serviceName 
          ? { ...cache, totalKeys: 0, memoryUsage: 0, hitRate: 0, missRate: 0 }
          : cache
      ));
      
      toast.success(`Cache do ${serviceName} limpo com sucesso`);
    } catch (error) {
      toast.error(`Erro ao limpar cache do ${serviceName}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Saudável</Badge>;
      case 'unhealthy':
        return <Badge className="bg-red-500"><AlertCircle className="h-3 w-3 mr-1" />Problema</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Desconhecido</Badge>;
    }
  };

  const getMethodBadge = (method: string) => {
    const colors = {
      GET: 'bg-blue-500',
      POST: 'bg-green-500',
      PUT: 'bg-yellow-500',
      DELETE: 'bg-red-500'
    };
    return <Badge className={colors[method as keyof typeof colors] || 'bg-gray-500'}>{method}</Badge>;
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Config-Service':
        return <Database className="h-5 w-5 text-blue-500" />;
      case 'Integration-Service':
        return <Shield className="h-5 w-5 text-orange-500" />;
      case 'Gamification-Service':
        return <Brain className="h-5 w-5 text-purple-500" />;
      default:
        return <Server className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Integração Completa</h2>
          <p className="text-muted-foreground">
            Monitoramento e gerenciamento de todos os endpoints e serviços
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadCompleteData} 
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            {autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            Auto-refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Endpoints</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{endpoints.length}</div>
            <p className="text-xs text-muted-foreground">
              {endpoints.filter(e => e.status === 'healthy').length} saudáveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(metrics.reduce((acc, m) => acc + m.uptime, 0) / metrics.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Últimas 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(metrics.reduce((acc, m) => acc + m.avgResponseTime, 0) / metrics.length)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Média geral
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {(cacheStatus.reduce((acc, c) => acc + c.hitRate, 0) / cacheStatus.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Performance cache
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {notifications.filter(n => n.active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Regras configuradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="endpoints" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Endpoints
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Métricas
          </TabsTrigger>
          <TabsTrigger value="cache" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Cache
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoramento de Endpoints</CardTitle>
              <CardDescription>
                Status e performance de todos os endpoints dos microserviços
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tempo Resposta</TableHead>
                    <TableHead>Taxa Sucesso</TableHead>
                    <TableHead>Última Verificação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {endpoints.map((endpoint) => (
                    <TableRow key={endpoint.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getServiceIcon(endpoint.service)}
                          <span className="font-medium">{endpoint.service}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-mono text-sm">{endpoint.endpoint}</div>
                          <div className="text-xs text-muted-foreground">{endpoint.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getMethodBadge(endpoint.method)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(endpoint.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${endpoint.responseTime > 500 ? 'text-red-600' : endpoint.responseTime > 200 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {endpoint.responseTime}ms
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={endpoint.successRate} className="w-16" />
                          <span className="text-sm">{endpoint.successRate.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {endpoint.lastCheck.toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => testEndpoint(endpoint)}
                          disabled={isLoading}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {metrics.map((metric) => (
              <Card key={metric.service}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getServiceIcon(metric.service)}
                      <CardTitle className="text-lg">{metric.service}</CardTitle>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reiniciar Serviço</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja reiniciar o {metric.service}? Esta ação pode causar indisponibilidade temporária.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => restartService(metric.service)}>
                            Reiniciar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                      <div className={`text-2xl font-bold ${metric.uptime > 99 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {metric.uptime.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Requisições</div>
                      <div className="text-2xl font-bold">{metric.totalRequests.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Tempo Médio</div>
                      <div className="text-2xl font-bold">{metric.avgResponseTime}ms</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Taxa de Erro</div>
                      <div className={`text-2xl font-bold ${metric.errorRate > 5 ? 'text-red-600' : 'text-green-600'}`}>
                        {metric.errorRate.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Cache Hit Rate</div>
                    <div className="flex items-center gap-2">
                      <Progress value={metric.cacheHitRate} className="flex-1" />
                      <span className="text-sm font-medium">{metric.cacheHitRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Último restart: {metric.lastRestart.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cache Tab */}
        <TabsContent value="cache" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {cacheStatus.map((cache) => (
              <Card key={cache.service}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getServiceIcon(cache.service)}
                      <CardTitle className="text-lg">{cache.service}</CardTitle>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => clearCache(cache.service)}
                    >
                      Limpar
                    </Button>
                  </div>
                  <CardDescription>
                    Cache {cache.type.toUpperCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Hit Rate</div>
                      <div className="text-2xl font-bold text-green-600">
                        {cache.hitRate.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Miss Rate</div>
                      <div className="text-2xl font-bold text-red-600">
                        {cache.missRate.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Keys</div>
                      <div className="text-2xl font-bold">{cache.totalKeys.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Uso Memória</div>
                      <div className="text-2xl font-bold">{cache.memoryUsage.toFixed(1)}MB</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Performance</div>
                    <div className="flex items-center gap-2">
                      <Progress value={cache.hitRate} className="flex-1" />
                      <span className="text-sm font-medium">{cache.hitRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    TTL: {cache.ttl}s
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Notificação</CardTitle>
              <CardDescription>
                Configure alertas automáticos para monitoramento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Condição</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Trigger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell className="font-medium">{notification.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{notification.service}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{notification.condition.replace('_', ' ')}</span>
                          <span className="font-mono">{notification.operator}</span>
                          <span className="font-bold">{notification.threshold}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          notification.condition === 'response_time' ? 'bg-blue-500' :
                          notification.condition === 'error_rate' ? 'bg-red-500' :
                          'bg-green-500'
                        }>
                          {notification.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {notification.active ? (
                          <Badge className="bg-green-500">
                            <BellRing className="h-3 w-3 mr-1" />
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Bell className="h-3 w-3 mr-1" />
                            Inativo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {notification.lastTriggered?.toLocaleString() || 'Nunca'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompleteIntegrationDashboard;

