import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  RefreshCw,
  Database,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { configService, Configuration } from '@/services/apiService';
import { toast } from 'sonner';

const ConfigurationManager: React.FC = () => {
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [filteredConfigurations, setFilteredConfigurations] = useState<Configuration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Configuration | null>(null);
  const [propagationStats, setPropagationStats] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
  });

  const loadConfigurations = async () => {
    setIsLoading(true);
    try {
      const configs = await configService.getAllConfigurations();
      setConfigurations(configs);
      setFilteredConfigurations(configs);
      
      // Carregar estatísticas de propagação
      const stats = await configService.getPropagationStats();
      setPropagationStats(stats);
    } catch (error) {
      console.error('Error loading configurations:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfigurations();
  }, []);

  useEffect(() => {
    let filtered = configurations;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(config => 
        config.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (config.description && config.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(config => config.key.startsWith(selectedCategory));
    }

    setFilteredConfigurations(filtered);
  }, [configurations, searchTerm, selectedCategory]);

  const handleSaveConfiguration = async () => {
    try {
      if (editingConfig) {
        // Atualizar configuração existente
        await configService.updateConfiguration(editingConfig.key, formData.value);
        toast.success('Configuração atualizada com sucesso');
      } else {
        // Criar nova configuração
        await configService.createConfiguration({
          key: formData.key,
          value: formData.value,
          description: formData.description,
        });
        toast.success('Configuração criada com sucesso');
      }
      
      setIsDialogOpen(false);
      setEditingConfig(null);
      setFormData({ key: '', value: '', description: '' });
      loadConfigurations();
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Erro ao salvar configuração');
    }
  };

  const handleEditConfiguration = (config: Configuration) => {
    setEditingConfig(config);
    setFormData({
      key: config.key,
      value: typeof config.value === 'object' ? JSON.stringify(config.value, null, 2) : config.value.toString(),
      description: config.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteConfiguration = async (key: string) => {
    if (confirm('Tem certeza que deseja excluir esta configuração?')) {
      try {
        await configService.deleteConfiguration(key);
        toast.success('Configuração excluída com sucesso');
        loadConfigurations();
      } catch (error) {
        console.error('Error deleting configuration:', error);
        toast.error('Erro ao excluir configuração');
      }
    }
  };

  const getConfigCategory = (key: string) => {
    if (key.startsWith('cpa.')) return 'CPA';
    if (key.startsWith('gamification.')) return 'Gamificação';
    if (key.startsWith('system.')) return 'Sistema';
    return 'Outros';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CPA': return 'bg-blue-500';
      case 'Gamificação': return 'bg-purple-500';
      case 'Sistema': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatValue = (value: any) => {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return value.toString();
  };

  const categories = ['all', 'cpa', 'gamification', 'system'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciador de Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie todas as configurações centralizadas do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadConfigurations} 
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nova Configuração
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingConfig ? 'Editar Configuração' : 'Nova Configuração'}
                </DialogTitle>
                <DialogDescription>
                  {editingConfig 
                    ? 'Modifique os valores da configuração existente'
                    : 'Adicione uma nova configuração ao sistema'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="key">Chave</Label>
                  <Input
                    id="key"
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    placeholder="Ex: cpa.validacao.deposito_minimo"
                    disabled={!!editingConfig}
                  />
                </div>
                <div>
                  <Label htmlFor="value">Valor</Label>
                  <Textarea
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="Valor da configuração"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição da configuração"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveConfiguration}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Configurações</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configurations.length}</div>
            <p className="text-xs text-muted-foreground">
              Configurações ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPA</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {configurations.filter(c => c.key.startsWith('cpa.')).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Configurações CPA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gamificação</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {configurations.filter(c => c.key.startsWith('gamification.')).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Configurações de gamificação
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
              {configurations.filter(c => c.key.startsWith('system.')).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Configurações de sistema
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Buscar por chave ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="all">Todas</option>
                <option value="cpa">CPA</option>
                <option value="gamification">Gamificação</option>
                <option value="system">Sistema</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações ({filteredConfigurations.length})</CardTitle>
          <CardDescription>
            Lista de todas as configurações do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Chave</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Atualizado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConfigurations.map((config) => (
                  <TableRow key={config.key}>
                    <TableCell>
                      <Badge className={getCategoryColor(getConfigCategory(config.key))}>
                        {getConfigCategory(config.key)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {config.key}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate font-mono text-sm">
                        {formatValue(config.value)}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm text-muted-foreground">
                        {config.description || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {config.updated_at ? new Date(config.updated_at).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditConfiguration(config)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteConfiguration(config.key)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Propagation Stats */}
      {propagationStats && (
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas de Propagação</CardTitle>
            <CardDescription>
              Informações sobre a propagação de configurações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Propagações Bem-sucedidas</p>
                  <p className="text-2xl font-bold">{propagationStats.successful_propagations || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Propagações Falharam</p>
                  <p className="text-2xl font-bold">{propagationStats.failed_propagations || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Última Propagação</p>
                  <p className="text-sm text-muted-foreground">
                    {propagationStats.last_propagation 
                      ? new Date(propagationStats.last_propagation).toLocaleString()
                      : 'Nunca'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConfigurationManager;

