import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
  Settings, 
  Save, 
  RefreshCw,
  DollarSign,
  Users,
  Target,
  Clock,
  Shield,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { configService } from '@/services/apiService';
import { toast } from 'sonner';

interface AdvancedConfig {
  category: string;
  configs: {
    key: string;
    value: any;
    type: 'number' | 'boolean' | 'string' | 'array';
    description: string;
    unit?: string;
    min?: number;
    max?: number;
  }[];
}

const AdvancedConfigurationPanel: React.FC = () => {
  const [configurations, setConfigurations] = useState<AdvancedConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('cpa');
  const [hasChanges, setHasChanges] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});

  // Configurações avançadas baseadas na análise
  const advancedConfigs: AdvancedConfig[] = [
    {
      category: 'cpa',
      configs: [
        {
          key: 'cpa.validacao.opcao1.deposito_minimo',
          value: 50.00,
          type: 'number',
          description: 'Valor mínimo de depósito para validação CPA - Opção 1',
          unit: 'R$',
          min: 10,
          max: 1000
        },
        {
          key: 'cpa.validacao.opcao1.numero_apostas',
          value: 10,
          type: 'number',
          description: 'Número mínimo de apostas para validação CPA - Opção 1',
          min: 1,
          max: 100
        },
        {
          key: 'cpa.validacao.opcao1.ggr_minimo',
          value: 25.00,
          type: 'number',
          description: 'GGR mínimo para validação CPA - Opção 1',
          unit: 'R$',
          min: 5,
          max: 500
        },
        {
          key: 'cpa.validacao.opcao2.deposito_minimo',
          value: 100.00,
          type: 'number',
          description: 'Valor mínimo de depósito para validação CPA - Opção 2',
          unit: 'R$',
          min: 10,
          max: 1000
        },
        {
          key: 'cpa.validacao.opcao2.numero_apostas',
          value: 20,
          type: 'number',
          description: 'Número mínimo de apostas para validação CPA - Opção 2',
          min: 1,
          max: 100
        },
        {
          key: 'cpa.validacao.opcao2.ggr_minimo',
          value: 50.00,
          type: 'number',
          description: 'GGR mínimo para validação CPA - Opção 2',
          unit: 'R$',
          min: 5,
          max: 500
        },
        {
          key: 'cpa.validacao.prazo_dias',
          value: 30,
          type: 'number',
          description: 'Prazo em dias para validação CPA',
          unit: 'dias',
          min: 1,
          max: 365
        },
        {
          key: 'cpa.deteccao_fraude.ativo',
          value: true,
          type: 'boolean',
          description: 'Ativar sistema de detecção de fraude'
        },
        {
          key: 'cpa.cache.ttl_segundos',
          value: 300,
          type: 'number',
          description: 'Tempo de vida do cache em segundos',
          unit: 's',
          min: 60,
          max: 3600
        }
      ]
    },
    {
      category: 'gamificacao',
      configs: [
        {
          key: 'gamificacao.analise_comportamental.ativo',
          value: true,
          type: 'boolean',
          description: 'Ativar análise comportamental com IA'
        },
        {
          key: 'gamificacao.score.peso_depositos',
          value: 0.4,
          type: 'number',
          description: 'Peso dos depósitos no score comportamental',
          min: 0,
          max: 1
        },
        {
          key: 'gamificacao.score.peso_apostas',
          value: 0.3,
          type: 'number',
          description: 'Peso das apostas no score comportamental',
          min: 0,
          max: 1
        },
        {
          key: 'gamificacao.score.peso_sessoes',
          value: 0.3,
          type: 'number',
          description: 'Peso das sessões no score comportamental',
          min: 0,
          max: 1
        },
        {
          key: 'gamificacao.baus.otimizacao_ia',
          value: true,
          type: 'boolean',
          description: 'Ativar otimização de baús por IA'
        },
        {
          key: 'gamificacao.campanhas.reativacao_automatica',
          value: true,
          type: 'boolean',
          description: 'Ativar campanhas de reativação automática'
        },
        {
          key: 'gamificacao.campanhas.score_minimo',
          value: 30,
          type: 'number',
          description: 'Score mínimo para campanhas de reativação',
          min: 0,
          max: 100
        }
      ]
    },
    {
      category: 'sistema',
      configs: [
        {
          key: 'sistema.monitoramento.intervalo_health_check',
          value: 30,
          type: 'number',
          description: 'Intervalo de health check em segundos',
          unit: 's',
          min: 10,
          max: 300
        },
        {
          key: 'sistema.logs.nivel',
          value: 'INFO',
          type: 'string',
          description: 'Nível de log do sistema'
        },
        {
          key: 'sistema.backup.automatico',
          value: true,
          type: 'boolean',
          description: 'Ativar backup automático'
        },
        {
          key: 'sistema.backup.intervalo_horas',
          value: 24,
          type: 'number',
          description: 'Intervalo de backup em horas',
          unit: 'h',
          min: 1,
          max: 168
        },
        {
          key: 'sistema.seguranca.timeout_sessao',
          value: 3600,
          type: 'number',
          description: 'Timeout de sessão em segundos',
          unit: 's',
          min: 300,
          max: 86400
        }
      ]
    }
  ];

  useEffect(() => {
    setConfigurations(advancedConfigs);
  }, []);

  const handleConfigChange = (key: string, value: any) => {
    setPendingChanges(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveConfiguration = async (key: string, value: any) => {
    try {
      await configService.updateConfiguration(key, value);
      toast.success(`Configuração ${key} atualizada com sucesso`);
      
      // Atualizar o valor na lista local
      setConfigurations(prev => 
        prev.map(category => ({
          ...category,
          configs: category.configs.map(config => 
            config.key === key ? { ...config, value } : config
          )
        }))
      );
      
      // Remover das mudanças pendentes
      setPendingChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[key];
        return newChanges;
      });
      
      // Verificar se ainda há mudanças pendentes
      setHasChanges(Object.keys(pendingChanges).length > 1);
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error(`Erro ao salvar configuração ${key}`);
    }
  };

  const saveAllChanges = async () => {
    setIsLoading(true);
    try {
      const promises = Object.entries(pendingChanges).map(([key, value]) =>
        configService.updateConfiguration(key, value)
      );
      
      await Promise.all(promises);
      toast.success(`${Object.keys(pendingChanges).length} configurações salvas com sucesso`);
      
      // Atualizar todas as configurações localmente
      setConfigurations(prev => 
        prev.map(category => ({
          ...category,
          configs: category.configs.map(config => 
            pendingChanges[config.key] !== undefined 
              ? { ...config, value: pendingChanges[config.key] }
              : config
          )
        }))
      );
      
      setPendingChanges({});
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving configurations:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const renderConfigInput = (config: any) => {
    const currentValue = pendingChanges[config.key] !== undefined 
      ? pendingChanges[config.key] 
      : config.value;

    switch (config.type) {
      case 'boolean':
        return (
          <Switch
            checked={currentValue}
            onCheckedChange={(checked) => handleConfigChange(config.key, checked)}
          />
        );
      case 'number':
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={currentValue}
              onChange={(e) => handleConfigChange(config.key, parseFloat(e.target.value))}
              min={config.min}
              max={config.max}
              className="w-32"
            />
            {config.unit && (
              <span className="text-sm text-muted-foreground">{config.unit}</span>
            )}
          </div>
        );
      case 'string':
        return (
          <Input
            value={currentValue}
            onChange={(e) => handleConfigChange(config.key, e.target.value)}
            className="w-48"
          />
        );
      default:
        return (
          <Input
            value={currentValue}
            onChange={(e) => handleConfigChange(config.key, e.target.value)}
            className="w-48"
          />
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cpa':
        return <Shield className="h-5 w-5 text-blue-500" />;
      case 'gamificacao':
        return <Target className="h-5 w-5 text-purple-500" />;
      case 'sistema':
        return <Settings className="h-5 w-5 text-green-500" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'cpa':
        return 'Configurações CPA';
      case 'gamificacao':
        return 'Configurações de Gamificação';
      case 'sistema':
        return 'Configurações de Sistema';
      default:
        return 'Configurações';
    }
  };

  const activeConfig = configurations.find(c => c.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações Avançadas</h2>
          <p className="text-muted-foreground">
            Gerencie todas as configurações avançadas do sistema
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button 
              onClick={saveAllChanges} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Salvar Todas ({Object.keys(pendingChanges).length})
            </Button>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configurações CPA</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {configurations.find(c => c.category === 'cpa')?.configs.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Regras de validação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gamificação</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {configurations.find(c => c.category === 'gamificacao')?.configs.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              IA e comportamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistema</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {configurations.find(c => c.category === 'sistema')?.configs.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Configurações gerais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mudanças Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {Object.keys(pendingChanges).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Não salvas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cpa" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            CPA
          </TabsTrigger>
          <TabsTrigger value="gamificacao" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Gamificação
          </TabsTrigger>
          <TabsTrigger value="sistema" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        {configurations.map((category) => (
          <TabsContent key={category.category} value={category.category} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {getCategoryIcon(category.category)}
                  <CardTitle>{getCategoryTitle(category.category)}</CardTitle>
                </div>
                <CardDescription>
                  Configure os parâmetros específicos para {category.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Configuração</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.configs.map((config) => (
                      <TableRow key={config.key}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{config.key}</div>
                            <div className="text-sm text-muted-foreground">
                              {config.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {renderConfigInput(config)}
                        </TableCell>
                        <TableCell>
                          {pendingChanges[config.key] !== undefined ? (
                            <Badge variant="outline" className="text-orange-600">
                              Modificado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-600">
                              Salvo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {pendingChanges[config.key] !== undefined && (
                            <Button
                              size="sm"
                              onClick={() => saveConfiguration(config.key, pendingChanges[config.key])}
                            >
                              <Save className="h-4 w-4" />
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
        ))}
      </Tabs>
    </div>
  );
};

export default AdvancedConfigurationPanel;

