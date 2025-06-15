import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Shield, 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  User,
  DollarSign,
  TrendingUp,
  Clock,
  Settings
} from 'lucide-react';
import { integrationService, CPAValidationRequest, CPAValidationResponse } from '@/services/apiService';
import { toast } from 'sonner';

interface CPAValidationLog {
  id: string;
  user_id: string;
  deposit_amount: number;
  bet_count: number;
  ggr_amount: number;
  result: 'approved' | 'rejected' | 'fraud';
  reason?: string;
  timestamp: Date;
  model_used: string;
}

const CPAAdvancedDashboard: React.FC = () => {
  const [validationLogs, setValidationLogs] = useState<CPAValidationLog[]>([]);
  const [cpaRules, setCpaRules] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  // Form state para teste manual
  const [testForm, setTestForm] = useState({
    user_id: '',
    deposit_amount: '',
    bet_count: '',
    ggr_amount: '',
    registration_date: new Date().toISOString().split('T')[0],
  });

  // Estatísticas
  const [stats, setStats] = useState({
    totalValidations: 0,
    approvedToday: 0,
    rejectedToday: 0,
    fraudDetected: 0,
    successRate: 0,
  });

  const loadCPARules = async () => {
    try {
      const rules = await integrationService.getCPARules();
      setCpaRules(rules);
    } catch (error) {
      console.error('Error loading CPA rules:', error);
      toast.error('Erro ao carregar regras CPA');
    }
  };

  const runCPATests = async () => {
    setIsLoading(true);
    try {
      const results = await integrationService.testCPA();
      setTestResults(results);
      toast.success('Testes CPA executados com sucesso');
      
      // Simular logs de validação baseados nos resultados dos testes
      if (results.test_results) {
        const newLogs: CPAValidationLog[] = results.test_results.map((test: any, index: number) => ({
          id: `test-${index}`,
          user_id: test.scenario || `test-user-${index}`,
          deposit_amount: test.deposit_amount || 0,
          bet_count: test.bet_count || 0,
          ggr_amount: test.ggr_amount || 0,
          result: test.result === 'APROVADO' ? 'approved' : 
                  test.result === 'REJEITADO' ? 'rejected' : 'fraud',
          reason: test.reason,
          timestamp: new Date(),
          model_used: test.model_used || 'Modelo 1.1',
        }));
        setValidationLogs(prev => [...newLogs, ...prev]);
        updateStats(newLogs);
      }
    } catch (error) {
      console.error('Error running CPA tests:', error);
      toast.error('Erro ao executar testes CPA');
    } finally {
      setIsLoading(false);
    }
  };

  const runManualValidation = async () => {
    try {
      const request: CPAValidationRequest = {
        user_id: testForm.user_id,
        deposit_amount: parseFloat(testForm.deposit_amount),
        bet_count: parseInt(testForm.bet_count),
        ggr_amount: parseFloat(testForm.ggr_amount),
        registration_date: testForm.registration_date,
      };

      const result = await integrationService.validateCPA(request);
      
      // Adicionar ao log
      const newLog: CPAValidationLog = {
        id: `manual-${Date.now()}`,
        user_id: request.user_id,
        deposit_amount: request.deposit_amount,
        bet_count: request.bet_count,
        ggr_amount: request.ggr_amount,
        result: result.valid ? 'approved' : (result.fraud_detected ? 'fraud' : 'rejected'),
        reason: result.reason,
        timestamp: new Date(),
        model_used: result.model_used || 'Manual',
      };

      setValidationLogs(prev => [newLog, ...prev]);
      updateStats([newLog]);
      
      setIsTestDialogOpen(false);
      setTestForm({
        user_id: '',
        deposit_amount: '',
        bet_count: '',
        ggr_amount: '',
        registration_date: new Date().toISOString().split('T')[0],
      });

      toast.success(`Validação ${result.valid ? 'aprovada' : 'rejeitada'}`);
    } catch (error) {
      console.error('Error running manual validation:', error);
      toast.error('Erro ao executar validação manual');
    }
  };

  const updateStats = (newLogs: CPAValidationLog[]) => {
    const today = new Date().toDateString();
    const todayLogs = newLogs.filter(log => log.timestamp.toDateString() === today);
    
    setStats(prev => ({
      totalValidations: prev.totalValidations + newLogs.length,
      approvedToday: prev.approvedToday + todayLogs.filter(log => log.result === 'approved').length,
      rejectedToday: prev.rejectedToday + todayLogs.filter(log => log.result === 'rejected').length,
      fraudDetected: prev.fraudDetected + todayLogs.filter(log => log.result === 'fraud').length,
      successRate: Math.round(((prev.approvedToday + todayLogs.filter(log => log.result === 'approved').length) / 
                              Math.max(1, prev.totalValidations + newLogs.length)) * 100),
    }));
  };

  useEffect(() => {
    loadCPARules();
  }, []);

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'approved':
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      case 'fraud':
        return <Badge className="bg-orange-500">Fraude</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'fraud':
        return <Shield className="h-4 w-4 text-orange-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">CPA Avançado</h2>
          <p className="text-muted-foreground">
            Motor de regras CPA com detecção de fraude e validação automática
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Teste Manual
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Validação CPA Manual</DialogTitle>
                <DialogDescription>
                  Execute uma validação CPA para um usuário específico
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user_id">ID do Usuário</Label>
                  <Input
                    id="user_id"
                    value={testForm.user_id}
                    onChange={(e) => setTestForm({ ...testForm, user_id: e.target.value })}
                    placeholder="Ex: user123"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deposit_amount">Valor Depositado (R$)</Label>
                    <Input
                      id="deposit_amount"
                      type="number"
                      value={testForm.deposit_amount}
                      onChange={(e) => setTestForm({ ...testForm, deposit_amount: e.target.value })}
                      placeholder="100.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bet_count">Número de Apostas</Label>
                    <Input
                      id="bet_count"
                      type="number"
                      value={testForm.bet_count}
                      onChange={(e) => setTestForm({ ...testForm, bet_count: e.target.value })}
                      placeholder="20"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ggr_amount">GGR (R$)</Label>
                    <Input
                      id="ggr_amount"
                      type="number"
                      value={testForm.ggr_amount}
                      onChange={(e) => setTestForm({ ...testForm, ggr_amount: e.target.value })}
                      placeholder="50.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="registration_date">Data de Registro</Label>
                    <Input
                      id="registration_date"
                      type="date"
                      value={testForm.registration_date}
                      onChange={(e) => setTestForm({ ...testForm, registration_date: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={runManualValidation}>
                  <Play className="h-4 w-4 mr-2" />
                  Validar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button 
            onClick={runCPATests} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Play className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Executar Testes
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Validações</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalValidations}</div>
            <p className="text-xs text-muted-foreground">
              Todas as validações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas Hoje</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedToday}</div>
            <p className="text-xs text-muted-foreground">
              Validações aprovadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas Hoje</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejectedToday}</div>
            <p className="text-xs text-muted-foreground">
              Validações rejeitadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraudes Detectadas</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.fraudDetected}</div>
            <p className="text-xs text-muted-foreground">
              Tentativas de fraude
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Aprovações vs total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="validations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="validations">Validações</TabsTrigger>
          <TabsTrigger value="rules">Regras CPA</TabsTrigger>
          <TabsTrigger value="tests">Resultados dos Testes</TabsTrigger>
        </TabsList>

        <TabsContent value="validations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Log de Validações CPA</CardTitle>
              <CardDescription>
                Histórico de todas as validações executadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {validationLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma validação executada ainda. Execute os testes para ver os resultados.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Depósito</TableHead>
                      <TableHead>Apostas</TableHead>
                      <TableHead>GGR</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationLogs.slice(0, 10).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getResultIcon(log.result)}
                            {getResultBadge(log.result)}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{log.user_id}</TableCell>
                        <TableCell>R$ {log.deposit_amount.toFixed(2)}</TableCell>
                        <TableCell>{log.bet_count}</TableCell>
                        <TableCell>R$ {log.ggr_amount.toFixed(2)}</TableCell>
                        <TableCell>{log.model_used}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {log.reason || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {log.timestamp.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regras CPA Ativas</CardTitle>
              <CardDescription>
                Configurações atuais do motor de regras CPA
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cpaRules ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Modelo Ativo</h4>
                      <p className="text-sm text-muted-foreground">
                        {cpaRules.active_model || 'Modelo 1.1 (Padrão)'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Detecção de Fraude</h4>
                      <Badge className={cpaRules.fraud_detection_enabled ? 'bg-green-500' : 'bg-red-500'}>
                        {cpaRules.fraud_detection_enabled ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                  </div>
                  
                  {cpaRules.rules && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Critérios de Validação</h4>
                      <div className="grid gap-2 md:grid-cols-3">
                        <div className="p-3 border rounded-lg">
                          <p className="text-sm font-medium">Depósito Mínimo</p>
                          <p className="text-lg font-bold">R$ {cpaRules.rules.deposit_minimum || '50,00'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-sm font-medium">Apostas Mínimas</p>
                          <p className="text-lg font-bold">{cpaRules.rules.bet_minimum || '10'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-sm font-medium">GGR Mínimo</p>
                          <p className="text-lg font-bold">R$ {cpaRules.rules.ggr_minimum || '25,00'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Carregando regras CPA...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resultados dos Testes Automatizados</CardTitle>
              <CardDescription>
                Resultados da última execução da suite de testes CPA
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <h4 className="font-semibold">Testes Aprovados</h4>
                      </div>
                      <p className="text-2xl font-bold">
                        {testResults.test_results?.filter((t: any) => t.result === 'APROVADO').length || 0}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <h4 className="font-semibold">Testes Rejeitados</h4>
                      </div>
                      <p className="text-2xl font-bold">
                        {testResults.test_results?.filter((t: any) => t.result === 'REJEITADO').length || 0}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-orange-500" />
                        <h4 className="font-semibold">Fraudes Detectadas</h4>
                      </div>
                      <p className="text-2xl font-bold">
                        {testResults.test_results?.filter((t: any) => t.result === 'FRAUDE DETECTADA').length || 0}
                      </p>
                    </div>
                  </div>

                  {testResults.test_results && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Detalhes dos Testes</h4>
                      <div className="space-y-2">
                        {testResults.test_results.map((test: any, index: number) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getResultIcon(test.result === 'APROVADO' ? 'approved' : 
                                              test.result === 'REJEITADO' ? 'rejected' : 'fraud')}
                                <span className="font-medium">{test.scenario}</span>
                              </div>
                              {getResultBadge(test.result === 'APROVADO' ? 'approved' : 
                                             test.result === 'REJEITADO' ? 'rejected' : 'fraud')}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {test.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Execute os testes para ver os resultados aqui.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CPAAdvancedDashboard;

