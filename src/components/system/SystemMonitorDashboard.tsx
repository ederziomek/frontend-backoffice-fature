import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Database, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Settings,
  Brain,
  Shield
} from 'lucide-react';
import { checkAllServicesHealth, configService, integrationService, gamificationService, ServiceStatus } from '@/services/apiService';

interface SystemMetrics {
  totalConfigurations: number;
  cpaValidationsToday: number;
  gamificationScores: number;
  systemUptime: string;
}

const SystemMonitorDashboard: React.FC = () => {
  const [servicesHealth, setServicesHealth] = useState<{
    configService: ServiceStatus;
    integrationService: ServiceStatus;
    gamificationService: ServiceStatus;
  }>({
    configService: { status: 'unknown' },
    integrationService: { status: 'unknown' },
    gamificationService: { status: 'unknown' },
  });

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalConfigurations: 0,
    cpaValidationsToday: 0,
    gamificationScores: 0,
    systemUptime: '0h 0m',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const checkServicesHealth = async () => {
    setIsLoading(true);
    try {
      const startTime = Date.now();
      const healthResults = await checkAllServicesHealth();
      const endTime = Date.now();

      // Adicionar tempo de resposta
      Object.keys(healthResults).forEach(service => {
        healthResults[service as keyof typeof healthResults].responseTime = endTime - startTime;
        healthResults[service as keyof typeof healthResults].lastCheck = new Date();
      });

      setServicesHealth(healthResults);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error checking services health:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSystemMetrics = async () => {
    try {
      // Carregar métricas do Config Service
      const configurations = await configService.getAllConfigurations();
      const propagationStats = await configService.getPropagationStats();

      // Carregar métricas do Integration Service
      const cpaRules = await integrationService.getCPARules();

      // Simular métricas do Gamification Service
      const gamificationTests = await gamificationService.runTestSuite();

      setSystemMetrics({
        totalConfigurations: configurations.length,
        cpaValidationsToday: cpaRules?.validations_today || 0,
        gamificationScores: gamificationTests?.profiles_analyzed || 0,
        systemUptime: propagationStats?.uptime || '0h 0m',
      });
    } catch (error) {
      console.error('Error loading system metrics:', error);
    }
  };

  useEffect(() => {
    checkServicesHealth();
    loadSystemMetrics();

    // Auto-refresh a cada 30 segundos
    const interval = setInterval(() => {
      checkServicesHealth();
      loadSystemMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'unhealthy':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-500">Online</Badge>;
      case 'unhealthy':
        return <Badge variant="destructive">Offline</Badge>;
      default:
        return <Badge variant="secondary">Verificando...</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Monitor do Sistema</h2>
          <p className="text-muted-foreground">
            Monitoramento em tempo real dos novos microserviços
          </p>
        </div>
        <Button 
          onClick={checkServicesHealth} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Config Service */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Config Service</CardTitle>
            {getStatusIcon(servicesHealth.configService.status)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">localhost:5000</p>
                {getStatusBadge(servicesHealth.configService.status)}
              </div>
              <Settings className="h-8 w-8 text-blue-500" />
            </div>
            {servicesHealth.configService.responseTime && (
              <p className="text-xs text-muted-foreground mt-2">
                Resposta: {servicesHealth.configService.responseTime}ms
              </p>
            )}
          </CardContent>
        </Card>

        {/* Integration Service */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integration Service</CardTitle>
            {getStatusIcon(servicesHealth.integrationService.status)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">localhost:3000</p>
                {getStatusBadge(servicesHealth.integrationService.status)}
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            {servicesHealth.integrationService.responseTime && (
              <p className="text-xs text-muted-foreground mt-2">
                Resposta: {servicesHealth.integrationService.responseTime}ms
              </p>
            )}
          </CardContent>
        </Card>

        {/* Gamification Service */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gamification Service</CardTitle>
            {getStatusIcon(servicesHealth.gamificationService.status)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">localhost:3001</p>
                {getStatusBadge(servicesHealth.gamificationService.status)}
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
            {servicesHealth.gamificationService.responseTime && (
              <p className="text-xs text-muted-foreground mt-2">
                Resposta: {servicesHealth.gamificationService.responseTime}ms
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configurações</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalConfigurations}</div>
            <p className="text-xs text-muted-foreground">
              Configurações ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validações CPA</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.cpaValidationsToday}</div>
            <p className="text-xs text-muted-foreground">
              Hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Análises IA</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.gamificationScores}</div>
            <p className="text-xs text-muted-foreground">
              Perfis analisados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.systemUptime}</div>
            <p className="text-xs text-muted-foreground">
              Sistema ativo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Status */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="config">Config Service</TabsTrigger>
          <TabsTrigger value="integration">Integration Service</TabsTrigger>
          <TabsTrigger value="gamification">Gamification Service</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status Geral do Sistema</CardTitle>
              <CardDescription>
                Última atualização: {lastUpdate.toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(servicesHealth).map(([serviceName, status]) => (
                  <div key={serviceName} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(status.status)}
                      <div>
                        <p className="font-medium capitalize">
                          {serviceName.replace('Service', ' Service')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {status.lastCheck ? `Verificado às ${status.lastCheck.toLocaleTimeString()}` : 'Não verificado'}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(status.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Config Service - Detalhes</CardTitle>
              <CardDescription>
                Serviço de configurações centralizadas (localhost:5000)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(servicesHealth.configService.status)}
                  <span>Status: </span>
                  {getStatusBadge(servicesHealth.configService.status)}
                </div>
                
                {servicesHealth.configService.status === 'unhealthy' && servicesHealth.configService.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Erro: {servicesHealth.configService.error.message || 'Serviço indisponível'}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-2 text-sm">
                  <p><strong>Endpoint:</strong> http://localhost:5000</p>
                  <p><strong>Configurações Ativas:</strong> {systemMetrics.totalConfigurations}</p>
                  <p><strong>Última Verificação:</strong> {servicesHealth.configService.lastCheck?.toLocaleString() || 'Nunca'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Service - Detalhes</CardTitle>
              <CardDescription>
                Motor de regras CPA e validações (localhost:3000)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(servicesHealth.integrationService.status)}
                  <span>Status: </span>
                  {getStatusBadge(servicesHealth.integrationService.status)}
                </div>
                
                {servicesHealth.integrationService.status === 'unhealthy' && servicesHealth.integrationService.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Erro: {servicesHealth.integrationService.error.message || 'Serviço indisponível'}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-2 text-sm">
                  <p><strong>Endpoint:</strong> http://localhost:3000</p>
                  <p><strong>Validações Hoje:</strong> {systemMetrics.cpaValidationsToday}</p>
                  <p><strong>Última Verificação:</strong> {servicesHealth.integrationService.lastCheck?.toLocaleString() || 'Nunca'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gamification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gamification Service - Detalhes</CardTitle>
              <CardDescription>
                Sistema de IA para gamificação (localhost:3001)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(servicesHealth.gamificationService.status)}
                  <span>Status: </span>
                  {getStatusBadge(servicesHealth.gamificationService.status)}
                </div>
                
                {servicesHealth.gamificationService.status === 'unhealthy' && servicesHealth.gamificationService.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Erro: {servicesHealth.gamificationService.error.message || 'Serviço indisponível'}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-2 text-sm">
                  <p><strong>Endpoint:</strong> http://localhost:3001</p>
                  <p><strong>Análises IA:</strong> {systemMetrics.gamificationScores}</p>
                  <p><strong>Última Verificação:</strong> {servicesHealth.gamificationService.lastCheck?.toLocaleString() || 'Nunca'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemMonitorDashboard;

