import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
  Brain, 
  Play, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  User,
  Gift,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Plus,
  Trash2
} from 'lucide-react';
import { 
  gamificationService, 
  BehaviorAnalysisRequest, 
  BehaviorAnalysisResponse,
  ChestOptimizationRequest,
  ChestOptimizationResponse 
} from '@/services/apiService';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UserProfile {
  user_id: string;
  behavioral_score: number;
  risk_classification: 'low' | 'medium' | 'high' | 'very_high';
  recommended_chests: Array<{
    type: string;
    probability: number;
    expected_value: number;
  }>;
  analysis_date: Date;
}

const GamificationAIDashboard: React.FC = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  // Form state para análise manual
  const [analysisForm, setAnalysisForm] = useState({
    user_id: '',
    deposits: [{ amount: '', date: '' }],
    bets: [{ amount: '', date: '' }],
    sessions: [{ duration: '', date: '' }],
  });

  // Estatísticas
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    averageScore: 0,
    highRiskUsers: 0,
    chestsOptimized: 0,
    reactivationCampaigns: 0,
  });

  // Dados para gráficos
  const [scoreDistribution, setScoreDistribution] = useState([
    { range: '0-20', count: 0, color: '#ef4444' },
    { range: '21-40', count: 0, color: '#f97316' },
    { range: '41-60', count: 0, color: '#eab308' },
    { range: '61-80', count: 0, color: '#22c55e' },
    { range: '81-100', count: 0, color: '#3b82f6' },
  ]);

  const [riskDistribution, setRiskDistribution] = useState([
    { name: 'Baixo', value: 0, color: '#22c55e' },
    { name: 'Médio', value: 0, color: '#eab308' },
    { name: 'Alto', value: 0, color: '#f97316' },
    { name: 'Muito Alto', value: 0, color: '#ef4444' },
  ]);

  const runGamificationTests = async () => {
    setIsLoading(true);
    try {
      const results = await gamificationService.runTestSuite();
      setTestResults(results);
      toast.success('Testes de gamificação executados com sucesso');
      
      // Simular perfis de usuário baseados nos resultados dos testes
      if (results.test_results) {
        const newProfiles: UserProfile[] = results.test_results.map((test: any, index: number) => ({
          user_id: test.user_id || `test-user-${index}`,
          behavioral_score: test.behavioral_score || Math.floor(Math.random() * 100),
          risk_classification: test.risk_classification || 'medium',
          recommended_chests: test.recommended_chests || [
            { type: 'Prata', probability: 0.7, expected_value: 35 },
            { type: 'Ouro', probability: 0.5, expected_value: 62.5 },
          ],
          analysis_date: new Date(),
        }));
        setUserProfiles(prev => [...newProfiles, ...prev]);
        updateStats(newProfiles);
        updateCharts(newProfiles);
      }
    } catch (error) {
      console.error('Error running gamification tests:', error);
      toast.error('Erro ao executar testes de gamificação');
    } finally {
      setIsLoading(false);
    }
  };

  const runManualAnalysis = async () => {
    try {
      const request: BehaviorAnalysisRequest = {
        user_id: analysisForm.user_id,
        deposits: analysisForm.deposits
          .filter(d => d.amount && d.date)
          .map(d => ({ amount: parseFloat(d.amount), date: d.date })),
        bets: analysisForm.bets
          .filter(b => b.amount && b.date)
          .map(b => ({ amount: parseFloat(b.amount), date: b.date })),
        sessions: analysisForm.sessions
          .filter(s => s.duration && s.date)
          .map(s => ({ duration: parseInt(s.duration), date: s.date })),
      };

      const behaviorResult = await gamificationService.analyzeBehavior(request);
      
      // Otimizar baús baseado na análise
      const chestRequest: ChestOptimizationRequest = {
        user_id: behaviorResult.user_id,
        behavioral_score: behaviorResult.behavioral_score,
        risk_classification: behaviorResult.risk_classification,
        available_chests: ['Bronze', 'Prata', 'Ouro', 'Platina', 'Diamante'],
      };

      const chestResult = await gamificationService.optimizeChests(chestRequest);
      
      // Adicionar ao perfil
      const newProfile: UserProfile = {
        user_id: behaviorResult.user_id,
        behavioral_score: behaviorResult.behavioral_score,
        risk_classification: behaviorResult.risk_classification,
        recommended_chests: chestResult.recommended_chests,
        analysis_date: new Date(),
      };

      setUserProfiles(prev => [newProfile, ...prev]);
      updateStats([newProfile]);
      updateCharts([newProfile]);
      
      setIsAnalysisDialogOpen(false);
      setAnalysisForm({
        user_id: '',
        deposits: [{ amount: '', date: '' }],
        bets: [{ amount: '', date: '' }],
        sessions: [{ duration: '', date: '' }],
      });

      toast.success(`Análise concluída - Score: ${behaviorResult.behavioral_score}`);
    } catch (error) {
      console.error('Error running manual analysis:', error);
      toast.error('Erro ao executar análise manual');
    }
  };

  const updateStats = (newProfiles: UserProfile[]) => {
    const totalScores = newProfiles.reduce((sum, profile) => sum + profile.behavioral_score, 0);
    const highRisk = newProfiles.filter(p => p.risk_classification === 'high' || p.risk_classification === 'very_high').length;
    
    setStats(prev => ({
      totalAnalyses: prev.totalAnalyses + newProfiles.length,
      averageScore: Math.round((prev.averageScore * prev.totalAnalyses + totalScores) / (prev.totalAnalyses + newProfiles.length)),
      highRiskUsers: prev.highRiskUsers + highRisk,
      chestsOptimized: prev.chestsOptimized + newProfiles.length,
      reactivationCampaigns: prev.reactivationCampaigns + newProfiles.filter(p => p.behavioral_score < 50).length,
    }));
  };

  const updateCharts = (allProfiles: UserProfile[]) => {
    // Atualizar distribuição de scores
    const scoreRanges = [0, 0, 0, 0, 0];
    allProfiles.forEach(profile => {
      const score = profile.behavioral_score;
      if (score <= 20) scoreRanges[0]++;
      else if (score <= 40) scoreRanges[1]++;
      else if (score <= 60) scoreRanges[2]++;
      else if (score <= 80) scoreRanges[3]++;
      else scoreRanges[4]++;
    });

    setScoreDistribution([
      { range: '0-20', count: scoreRanges[0], color: '#ef4444' },
      { range: '21-40', count: scoreRanges[1], color: '#f97316' },
      { range: '41-60', count: scoreRanges[2], color: '#eab308' },
      { range: '61-80', count: scoreRanges[3], color: '#22c55e' },
      { range: '81-100', count: scoreRanges[4], color: '#3b82f6' },
    ]);

    // Atualizar distribuição de riscos
    const riskCounts = { low: 0, medium: 0, high: 0, very_high: 0 };
    allProfiles.forEach(profile => {
      riskCounts[profile.risk_classification]++;
    });

    setRiskDistribution([
      { name: 'Baixo', value: riskCounts.low, color: '#22c55e' },
      { name: 'Médio', value: riskCounts.medium, color: '#eab308' },
      { name: 'Alto', value: riskCounts.high, color: '#f97316' },
      { name: 'Muito Alto', value: riskCounts.very_high, color: '#ef4444' },
    ]);
  };

  const addFormField = (type: 'deposits' | 'bets' | 'sessions') => {
    setAnalysisForm(prev => ({
      ...prev,
      [type]: [...prev[type], type === 'sessions' ? { duration: '', date: '' } : { amount: '', date: '' }],
    }));
  };

  const removeFormField = (type: 'deposits' | 'bets' | 'sessions', index: number) => {
    setAnalysisForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const updateFormField = (type: 'deposits' | 'bets' | 'sessions', index: number, field: string, value: string) => {
    setAnalysisForm(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? { ...item, [field]: value } : item),
    }));
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge className="bg-green-500">Baixo</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Médio</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">Alto</Badge>;
      case 'very_high':
        return <Badge className="bg-red-500">Muito Alto</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-blue-600';
    if (score >= 60) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    if (score >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gamificação IA</h2>
          <p className="text-muted-foreground">
            Análise comportamental inteligente e otimização de recompensas
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAnalysisDialogOpen} onOpenChange={setIsAnalysisDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Análise Manual
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Análise Comportamental Manual</DialogTitle>
                <DialogDescription>
                  Execute uma análise comportamental para um usuário específico
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="user_id">ID do Usuário</Label>
                  <Input
                    id="user_id"
                    value={analysisForm.user_id}
                    onChange={(e) => setAnalysisForm({ ...analysisForm, user_id: e.target.value })}
                    placeholder="Ex: user123"
                  />
                </div>

                {/* Depósitos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Histórico de Depósitos</Label>
                    <Button size="sm" onClick={() => addFormField('deposits')}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {analysisForm.deposits.map((deposit, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Valor (R$)"
                        value={deposit.amount}
                        onChange={(e) => updateFormField('deposits', index, 'amount', e.target.value)}
                      />
                      <Input
                        type="date"
                        value={deposit.date}
                        onChange={(e) => updateFormField('deposits', index, 'date', e.target.value)}
                      />
                      {analysisForm.deposits.length > 1 && (
                        <Button size="sm" variant="outline" onClick={() => removeFormField('deposits', index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Apostas */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Histórico de Apostas</Label>
                    <Button size="sm" onClick={() => addFormField('bets')}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {analysisForm.bets.map((bet, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Valor (R$)"
                        value={bet.amount}
                        onChange={(e) => updateFormField('bets', index, 'amount', e.target.value)}
                      />
                      <Input
                        type="date"
                        value={bet.date}
                        onChange={(e) => updateFormField('bets', index, 'date', e.target.value)}
                      />
                      {analysisForm.bets.length > 1 && (
                        <Button size="sm" variant="outline" onClick={() => removeFormField('bets', index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Sessões */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Histórico de Sessões</Label>
                    <Button size="sm" onClick={() => addFormField('sessions')}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {analysisForm.sessions.map((session, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Duração (minutos)"
                        value={session.duration}
                        onChange={(e) => updateFormField('sessions', index, 'duration', e.target.value)}
                      />
                      <Input
                        type="date"
                        value={session.date}
                        onChange={(e) => updateFormField('sessions', index, 'date', e.target.value)}
                      />
                      {analysisForm.sessions.length > 1 && (
                        <Button size="sm" variant="outline" onClick={() => removeFormField('sessions', index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAnalysisDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={runManualAnalysis}>
                  <Brain className="h-4 w-4 mr-2" />
                  Analisar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button 
            onClick={runGamificationTests} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Play className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Executar Testes IA
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Análises Realizadas</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
            <p className="text-xs text-muted-foreground">
              Perfis analisados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
              {stats.averageScore}
            </div>
            <p className="text-xs text-muted-foreground">
              Pontuação comportamental
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alto Risco</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highRiskUsers}</div>
            <p className="text-xs text-muted-foreground">
              Usuários de alto risco
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Baús Otimizados</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.chestsOptimized}</div>
            <p className="text-xs text-muted-foreground">
              Recompensas personalizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.reactivationCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              Reativação automática
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Scores Comportamentais</CardTitle>
            <CardDescription>
              Distribuição dos scores de 0 a 100
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classificação de Risco</CardTitle>
            <CardDescription>
              Distribuição dos usuários por nível de risco
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profiles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profiles">Perfis de Usuários</TabsTrigger>
          <TabsTrigger value="optimization">Otimização de Baús</TabsTrigger>
          <TabsTrigger value="tests">Resultados dos Testes</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perfis Comportamentais Analisados</CardTitle>
              <CardDescription>
                Lista de usuários com análise comportamental completa
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userProfiles.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma análise executada ainda. Execute os testes para ver os resultados.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Score Comportamental</TableHead>
                      <TableHead>Classificação de Risco</TableHead>
                      <TableHead>Baús Recomendados</TableHead>
                      <TableHead>Valor Esperado</TableHead>
                      <TableHead>Data da Análise</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userProfiles.slice(0, 10).map((profile, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{profile.user_id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`text-lg font-bold ${getScoreColor(profile.behavioral_score)}`}>
                              {profile.behavioral_score}
                            </div>
                            <Progress value={profile.behavioral_score} className="w-20" />
                          </div>
                        </TableCell>
                        <TableCell>
                          {getRiskBadge(profile.risk_classification)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {profile.recommended_chests.slice(0, 2).map((chest, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {chest.type}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          R$ {profile.recommended_chests.reduce((sum, chest) => sum + chest.expected_value, 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {profile.analysis_date.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Otimização de Baús por IA</CardTitle>
              <CardDescription>
                Recomendações personalizadas baseadas em análise comportamental
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userProfiles.length === 0 ? (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Execute análises para ver as otimizações de baús.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userProfiles.slice(0, 5).map((profile, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="font-mono font-medium">{profile.user_id}</div>
                          <div className={`text-sm font-bold ${getScoreColor(profile.behavioral_score)}`}>
                            Score: {profile.behavioral_score}
                          </div>
                          {getRiskBadge(profile.risk_classification)}
                        </div>
                      </div>
                      <div className="grid gap-3 md:grid-cols-3">
                        {profile.recommended_chests.map((chest, i) => (
                          <div key={i} className="p-3 bg-muted rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Baú {chest.type}</span>
                              <Badge variant="outline">{(chest.probability * 100).toFixed(0)}%</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Valor esperado: R$ {chest.expected_value.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resultados dos Testes de IA</CardTitle>
              <CardDescription>
                Resultados da última execução da suite de testes de gamificação
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <h4 className="font-semibold">Perfis Analisados</h4>
                      </div>
                      <p className="text-2xl font-bold">
                        {testResults.test_results?.length || 0}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-5 w-5 text-blue-500" />
                        <h4 className="font-semibold">Score Médio</h4>
                      </div>
                      <p className="text-2xl font-bold">
                        {testResults.average_score || 0}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="h-5 w-5 text-purple-500" />
                        <h4 className="font-semibold">Baús Otimizados</h4>
                      </div>
                      <p className="text-2xl font-bold">
                        {testResults.chests_optimized || 0}
                      </p>
                    </div>
                  </div>

                  {testResults.test_results && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Detalhes dos Testes</h4>
                      <div className="space-y-2">
                        {testResults.test_results.map((test: any, index: number) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Brain className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">{test.user_type || `Perfil ${index + 1}`}</span>
                              </div>
                              <div className={`text-lg font-bold ${getScoreColor(test.behavioral_score || 0)}`}>
                                Score: {test.behavioral_score || 0}
                              </div>
                            </div>
                            <div className="grid gap-2 md:grid-cols-2">
                              <div>
                                <span className="text-sm text-muted-foreground">Classificação: </span>
                                {getRiskBadge(test.risk_classification || 'medium')}
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">Valor esperado: </span>
                                <span className="font-medium">R$ {test.expected_value || '0,00'}</span>
                              </div>
                            </div>
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
                    Execute os testes de IA para ver os resultados aqui.
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

export default GamificationAIDashboard;

