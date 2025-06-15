import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  UserCheck,
  Activity,
  Target,
  Award,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  FileText,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface KPIData {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  revenue?: number;
  users?: number;
  conversions?: number;
  date?: string;
}

interface FinancialReport {
  period: string;
  totalRevenue: number;
  cpaPayments: number;
  commissions: number;
  netProfit: number;
  growth: number;
  transactions: number;
}

interface UserAnalytics {
  segment: string;
  users: number;
  revenue: number;
  avgLifetime: number;
  conversionRate: number;
  churnRate: number;
}

interface PerformanceMetrics {
  metric: string;
  current: number;
  target: number;
  performance: number;
  trend: 'up' | 'down' | 'stable';
}

const ExecutiveDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<ChartData[]>([]);
  const [conversionData, setConversionData] = useState<ChartData[]>([]);
  const [financialReports, setFinancialReports] = useState<FinancialReport[]>([]);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    // Simular carregamento de dados
    await new Promise(resolve => setTimeout(resolve, 1000));

    // KPIs principais
    const kpis: KPIData[] = [
      {
        title: 'Receita Total',
        value: 'R$ 2.847.350',
        change: 12.5,
        trend: 'up',
        icon: <DollarSign className="h-6 w-6" />,
        color: 'text-green-600'
      },
      {
        title: 'Usuários Ativos',
        value: '18.542',
        change: 8.2,
        trend: 'up',
        icon: <Users className="h-6 w-6" />,
        color: 'text-blue-600'
      },
      {
        title: 'Conversões CPA',
        value: '1.247',
        change: -3.1,
        trend: 'down',
        icon: <UserCheck className="h-6 w-6" />,
        color: 'text-orange-600'
      },
      {
        title: 'Taxa Conversão',
        value: '6.73%',
        change: 1.8,
        trend: 'up',
        icon: <Target className="h-6 w-6" />,
        color: 'text-purple-600'
      },
      {
        title: 'Ticket Médio',
        value: 'R$ 153.67',
        change: 5.4,
        trend: 'up',
        icon: <Award className="h-6 w-6" />,
        color: 'text-indigo-600'
      },
      {
        title: 'ROI Campanhas',
        value: '284%',
        change: 15.2,
        trend: 'up',
        icon: <Activity className="h-6 w-6" />,
        color: 'text-emerald-600'
      }
    ];

    // Dados de receita por período
    const revenue: ChartData[] = [
      { name: 'Jan', value: 245000, revenue: 245000 },
      { name: 'Fev', value: 289000, revenue: 289000 },
      { name: 'Mar', value: 324000, revenue: 324000 },
      { name: 'Abr', value: 356000, revenue: 356000 },
      { name: 'Mai', value: 398000, revenue: 398000 },
      { name: 'Jun', value: 445000, revenue: 445000 },
      { name: 'Jul', value: 487000, revenue: 487000 },
      { name: 'Ago', value: 523000, revenue: 523000 },
      { name: 'Set', value: 578000, revenue: 578000 },
      { name: 'Out', value: 634000, revenue: 634000 },
      { name: 'Nov', value: 689000, revenue: 689000 },
      { name: 'Dez', value: 745000, revenue: 745000 }
    ];

    // Crescimento de usuários
    const userGrowth: ChartData[] = [
      { name: 'Sem 1', users: 12450, conversions: 834 },
      { name: 'Sem 2', users: 13200, conversions: 891 },
      { name: 'Sem 3', users: 14100, conversions: 952 },
      { name: 'Sem 4', users: 15300, conversions: 1034 },
      { name: 'Sem 5', users: 16800, conversions: 1127 },
      { name: 'Sem 6', users: 18200, conversions: 1245 },
      { name: 'Sem 7', users: 19500, conversions: 1356 },
      { name: 'Sem 8', users: 20800, conversions: 1423 }
    ];

    // Dados de conversão por canal
    const conversion: ChartData[] = [
      { name: 'Orgânico', value: 35, revenue: 1250000 },
      { name: 'Afiliados', value: 28, revenue: 980000 },
      { name: 'Social Media', value: 18, revenue: 650000 },
      { name: 'Email', value: 12, revenue: 420000 },
      { name: 'Paid Ads', value: 7, revenue: 245000 }
    ];

    // Relatórios financeiros
    const financial: FinancialReport[] = [
      {
        period: 'Dezembro 2024',
        totalRevenue: 745000,
        cpaPayments: 186250,
        commissions: 74500,
        netProfit: 484250,
        growth: 8.5,
        transactions: 4850
      },
      {
        period: 'Novembro 2024',
        totalRevenue: 689000,
        cpaPayments: 172250,
        commissions: 68900,
        netProfit: 447850,
        growth: 7.2,
        transactions: 4456
      },
      {
        period: 'Outubro 2024',
        totalRevenue: 634000,
        cpaPayments: 158500,
        commissions: 63400,
        netProfit: 412100,
        growth: 9.8,
        transactions: 4123
      }
    ];

    // Analytics de usuários
    const analytics: UserAnalytics[] = [
      {
        segment: 'VIP',
        users: 1250,
        revenue: 485000,
        avgLifetime: 18.5,
        conversionRate: 15.8,
        churnRate: 2.1
      },
      {
        segment: 'Premium',
        users: 3400,
        revenue: 892000,
        avgLifetime: 12.3,
        conversionRate: 8.9,
        churnRate: 4.5
      },
      {
        segment: 'Regular',
        users: 8900,
        revenue: 1245000,
        avgLifetime: 8.7,
        conversionRate: 5.2,
        churnRate: 8.2
      },
      {
        segment: 'Novatos',
        users: 4992,
        revenue: 225000,
        avgLifetime: 2.1,
        conversionRate: 2.8,
        churnRate: 15.6
      }
    ];

    // Métricas de performance
    const performance: PerformanceMetrics[] = [
      { metric: 'Tempo de Resposta API', current: 285, target: 300, performance: 95, trend: 'up' },
      { metric: 'Uptime Sistema', current: 99.8, target: 99.5, performance: 100, trend: 'stable' },
      { metric: 'Taxa de Conversão', current: 6.73, target: 6.5, performance: 103, trend: 'up' },
      { metric: 'Satisfação Cliente', current: 4.6, target: 4.5, performance: 102, trend: 'up' },
      { metric: 'Tempo Resolução', current: 2.3, target: 3.0, performance: 123, trend: 'up' }
    ];

    setKpiData(kpis);
    setRevenueData(revenue);
    setUserGrowthData(userGrowth);
    setConversionData(conversion);
    setFinancialReports(financial);
    setUserAnalytics(analytics);
    setPerformanceMetrics(performance);
    setIsLoading(false);
  };

  const exportReport = (type: string) => {
    toast.success(`Relatório ${type} exportado com sucesso`);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Executivo</h2>
          <p className="text-muted-foreground">
            Visão completa dos KPIs e métricas de negócio
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={loadDashboardData} 
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button 
            onClick={() => exportReport('executivo')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <div className={kpi.color}>
                {kpi.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {getTrendIcon(kpi.trend)}
                <span className={getTrendColor(kpi.trend)}>
                  {kpi.change > 0 ? '+' : ''}{kpi.change}%
                </span>
                <span className="text-muted-foreground">vs período anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedReport} onValueChange={setSelectedReport} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5" />
                  Evolução da Receita
                </CardTitle>
                <CardDescription>
                  Receita mensal nos últimos 12 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, 'Receita']} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Crescimento de Usuários
                </CardTitle>
                <CardDescription>
                  Usuários ativos e conversões semanais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#10b981" name="Usuários" />
                    <Bar dataKey="conversions" fill="#3b82f6" name="Conversões" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Conversion by Channel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Conversões por Canal
              </CardTitle>
              <CardDescription>
                Distribuição de conversões e receita por canal de aquisição
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={conversionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {conversionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {conversionData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.value}%</div>
                        <div className="text-sm text-muted-foreground">
                          R$ {item.revenue?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Relatórios Financeiros</CardTitle>
                  <CardDescription>
                    Análise detalhada de receitas, custos e lucros
                  </CardDescription>
                </div>
                <Button onClick={() => exportReport('financeiro')} variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead>Receita Total</TableHead>
                    <TableHead>Pagamentos CPA</TableHead>
                    <TableHead>Comissões</TableHead>
                    <TableHead>Lucro Líquido</TableHead>
                    <TableHead>Crescimento</TableHead>
                    <TableHead>Transações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialReports.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{report.period}</TableCell>
                      <TableCell>R$ {report.totalRevenue.toLocaleString()}</TableCell>
                      <TableCell>R$ {report.cpaPayments.toLocaleString()}</TableCell>
                      <TableCell>R$ {report.commissions.toLocaleString()}</TableCell>
                      <TableCell className="font-bold text-green-600">
                        R$ {report.netProfit.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">+{report.growth}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{report.transactions.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics de Usuários</CardTitle>
              <CardDescription>
                Segmentação e comportamento dos usuários por categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Segmento</TableHead>
                    <TableHead>Usuários</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead>Lifetime Médio</TableHead>
                    <TableHead>Taxa Conversão</TableHead>
                    <TableHead>Taxa Churn</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userAnalytics.map((segment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge 
                          className={
                            segment.segment === 'VIP' ? 'bg-purple-500' :
                            segment.segment === 'Premium' ? 'bg-blue-500' :
                            segment.segment === 'Regular' ? 'bg-green-500' :
                            'bg-gray-500'
                          }
                        >
                          {segment.segment}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {segment.users.toLocaleString()}
                      </TableCell>
                      <TableCell>R$ {segment.revenue.toLocaleString()}</TableCell>
                      <TableCell>{segment.avgLifetime} meses</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{segment.conversionRate}%</span>
                          {segment.conversionRate > 10 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={segment.churnRate > 10 ? 'text-red-600' : 'text-green-600'}>
                          {segment.churnRate}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Performance</CardTitle>
              <CardDescription>
                Indicadores de performance técnica e de negócio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{metric.metric}</span>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{metric.current}</div>
                        <div className="text-sm text-muted-foreground">
                          Meta: {metric.target}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.performance >= 100 ? 'bg-green-500' :
                          metric.performance >= 80 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(metric.performance, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Performance: {metric.performance}%</span>
                      <span>
                        {metric.performance >= 100 ? 'Acima da meta' :
                         metric.performance >= 80 ? 'Próximo da meta' :
                         'Abaixo da meta'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutiveDashboard;

