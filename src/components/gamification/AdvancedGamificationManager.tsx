import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Gift, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  RefreshCw,
  Target,
  TrendingUp,
  Users,
  Award,
  Zap,
  Brain,
  Settings,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';

interface ChestType {
  id: string;
  name: string;
  color: string;
  icon: string;
  minValue: number;
  maxValue: number;
  probability: number;
  requirements: {
    directReferrals: number;
    totalVolume: number;
    behavioralScore: number;
  };
  rewards: {
    type: 'money' | 'percentage' | 'multiplier' | 'chest';
    value: number;
    description: string;
  }[];
  aiOptimization: boolean;
  active: boolean;
}

interface ReactivationCampaign {
  id: string;
  name: string;
  targetAudience: 'low_score' | 'inactive' | 'high_value' | 'custom';
  triggers: {
    inactivityDays: number;
    minBehavioralScore: number;
    maxBehavioralScore: number;
    lastDepositDays: number;
  };
  rewards: {
    chestType: string;
    bonusPercentage: number;
    freeSpins: number;
  };
  active: boolean;
  performance: {
    sent: number;
    opened: number;
    converted: number;
    revenue: number;
  };
}

interface BehavioralAnalysis {
  userId: string;
  score: number;
  classification: 'low' | 'medium' | 'high' | 'very_high';
  patterns: {
    depositFrequency: string;
    bettingPattern: string;
    sessionDuration: string;
    riskLevel: string;
  };
  recommendations: string[];
  lastAnalysis: Date;
}

const AdvancedGamificationManager: React.FC = () => {
  const [chestTypes, setChestTypes] = useState<ChestType[]>([]);
  const [campaigns, setCampaigns] = useState<ReactivationCampaign[]>([]);
  const [behavioralData, setBehavioralData] = useState<BehavioralAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chests');
  const [isChestDialogOpen, setIsChestDialogOpen] = useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [editingChest, setEditingChest] = useState<ChestType | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<ReactivationCampaign | null>(null);

  // Estados para formulários
  const [chestForm, setChestForm] = useState({
    name: '',
    color: '#3b82f6',
    minValue: 0,
    maxValue: 100,
    probability: 0.5,
    directReferrals: 0,
    totalVolume: 0,
    behavioralScore: 0,
    aiOptimization: true,
    active: true
  });

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    targetAudience: 'low_score',
    inactivityDays: 7,
    minBehavioralScore: 0,
    maxBehavioralScore: 30,
    lastDepositDays: 30,
    chestType: '',
    bonusPercentage: 10,
    freeSpins: 0,
    active: true
  });

  // Dados iniciais simulados
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    // Tipos de baús avançados
    const initialChests: ChestType[] = [
      {
        id: 'bronze_basic',
        name: 'Baú Bronze Básico',
        color: '#cd7f32',
        icon: 'gift',
        minValue: 5,
        maxValue: 25,
        probability: 0.8,
        requirements: { directReferrals: 1, totalVolume: 100, behavioralScore: 20 },
        rewards: [
          { type: 'money', value: 15, description: 'R$ 15 em dinheiro' },
          { type: 'percentage', value: 5, description: '5% de bônus' }
        ],
        aiOptimization: false,
        active: true
      },
      {
        id: 'silver_smart',
        name: 'Baú Prata Inteligente',
        color: '#c0c0c0',
        icon: 'target',
        minValue: 25,
        maxValue: 75,
        probability: 0.6,
        requirements: { directReferrals: 3, totalVolume: 500, behavioralScore: 40 },
        rewards: [
          { type: 'money', value: 50, description: 'R$ 50 em dinheiro' },
          { type: 'multiplier', value: 1.5, description: '1.5x multiplicador' }
        ],
        aiOptimization: true,
        active: true
      },
      {
        id: 'gold_premium',
        name: 'Baú Ouro Premium',
        color: '#ffd700',
        icon: 'crown',
        minValue: 75,
        maxValue: 200,
        probability: 0.4,
        requirements: { directReferrals: 5, totalVolume: 1000, behavioralScore: 60 },
        rewards: [
          { type: 'money', value: 125, description: 'R$ 125 em dinheiro' },
          { type: 'chest', value: 1, description: 'Baú adicional' }
        ],
        aiOptimization: true,
        active: true
      },
      {
        id: 'diamond_elite',
        name: 'Baú Diamante Elite',
        color: '#b9f2ff',
        icon: 'award',
        minValue: 200,
        maxValue: 500,
        probability: 0.2,
        requirements: { directReferrals: 10, totalVolume: 5000, behavioralScore: 80 },
        rewards: [
          { type: 'money', value: 350, description: 'R$ 350 em dinheiro' },
          { type: 'multiplier', value: 2.0, description: '2x multiplicador' }
        ],
        aiOptimization: true,
        active: true
      }
    ];

    // Campanhas de reativação
    const initialCampaigns: ReactivationCampaign[] = [
      {
        id: 'low_score_reactivation',
        name: 'Reativação Score Baixo',
        targetAudience: 'low_score',
        triggers: {
          inactivityDays: 7,
          minBehavioralScore: 0,
          maxBehavioralScore: 30,
          lastDepositDays: 14
        },
        rewards: {
          chestType: 'bronze_basic',
          bonusPercentage: 15,
          freeSpins: 10
        },
        active: true,
        performance: {
          sent: 1250,
          opened: 875,
          converted: 156,
          revenue: 2340
        }
      },
      {
        id: 'high_value_retention',
        name: 'Retenção Alto Valor',
        targetAudience: 'high_value',
        triggers: {
          inactivityDays: 3,
          minBehavioralScore: 70,
          maxBehavioralScore: 100,
          lastDepositDays: 7
        },
        rewards: {
          chestType: 'gold_premium',
          bonusPercentage: 25,
          freeSpins: 50
        },
        active: true,
        performance: {
          sent: 320,
          opened: 288,
          converted: 89,
          revenue: 8950
        }
      }
    ];

    // Dados de análise comportamental
    const initialBehavioral: BehavioralAnalysis[] = [
      {
        userId: 'user_001',
        score: 85,
        classification: 'very_high',
        patterns: {
          depositFrequency: 'Alta (3x/semana)',
          bettingPattern: 'Conservador',
          sessionDuration: 'Longa (45min)',
          riskLevel: 'Baixo'
        },
        recommendations: [
          'Oferecer baús premium',
          'Programa VIP',
          'Cashback especial'
        ],
        lastAnalysis: new Date()
      },
      {
        userId: 'user_002',
        score: 25,
        classification: 'low',
        patterns: {
          depositFrequency: 'Baixa (1x/mês)',
          bettingPattern: 'Irregular',
          sessionDuration: 'Curta (10min)',
          riskLevel: 'Alto'
        },
        recommendations: [
          'Campanha de reativação',
          'Bônus de primeiro depósito',
          'Tutorial de jogos'
        ],
        lastAnalysis: new Date()
      }
    ];

    setChestTypes(initialChests);
    setCampaigns(initialCampaigns);
    setBehavioralData(initialBehavioral);
  };

  const handleSaveChest = () => {
    const newChest: ChestType = {
      id: editingChest?.id || `chest_${Date.now()}`,
      name: chestForm.name,
      color: chestForm.color,
      icon: 'gift',
      minValue: chestForm.minValue,
      maxValue: chestForm.maxValue,
      probability: chestForm.probability,
      requirements: {
        directReferrals: chestForm.directReferrals,
        totalVolume: chestForm.totalVolume,
        behavioralScore: chestForm.behavioralScore
      },
      rewards: [
        { type: 'money', value: (chestForm.minValue + chestForm.maxValue) / 2, description: `R$ ${(chestForm.minValue + chestForm.maxValue) / 2} em dinheiro` }
      ],
      aiOptimization: chestForm.aiOptimization,
      active: chestForm.active
    };

    if (editingChest) {
      setChestTypes(prev => prev.map(chest => chest.id === editingChest.id ? newChest : chest));
      toast.success('Baú atualizado com sucesso');
    } else {
      setChestTypes(prev => [...prev, newChest]);
      toast.success('Novo baú criado com sucesso');
    }

    setIsChestDialogOpen(false);
    setEditingChest(null);
    resetChestForm();
  };

  const handleSaveCampaign = () => {
    const newCampaign: ReactivationCampaign = {
      id: editingCampaign?.id || `campaign_${Date.now()}`,
      name: campaignForm.name,
      targetAudience: campaignForm.targetAudience as any,
      triggers: {
        inactivityDays: campaignForm.inactivityDays,
        minBehavioralScore: campaignForm.minBehavioralScore,
        maxBehavioralScore: campaignForm.maxBehavioralScore,
        lastDepositDays: campaignForm.lastDepositDays
      },
      rewards: {
        chestType: campaignForm.chestType,
        bonusPercentage: campaignForm.bonusPercentage,
        freeSpins: campaignForm.freeSpins
      },
      active: campaignForm.active,
      performance: editingCampaign?.performance || {
        sent: 0,
        opened: 0,
        converted: 0,
        revenue: 0
      }
    };

    if (editingCampaign) {
      setCampaigns(prev => prev.map(campaign => campaign.id === editingCampaign.id ? newCampaign : campaign));
      toast.success('Campanha atualizada com sucesso');
    } else {
      setCampaigns(prev => [...prev, newCampaign]);
      toast.success('Nova campanha criada com sucesso');
    }

    setIsCampaignDialogOpen(false);
    setEditingCampaign(null);
    resetCampaignForm();
  };

  const resetChestForm = () => {
    setChestForm({
      name: '',
      color: '#3b82f6',
      minValue: 0,
      maxValue: 100,
      probability: 0.5,
      directReferrals: 0,
      totalVolume: 0,
      behavioralScore: 0,
      aiOptimization: true,
      active: true
    });
  };

  const resetCampaignForm = () => {
    setCampaignForm({
      name: '',
      targetAudience: 'low_score',
      inactivityDays: 7,
      minBehavioralScore: 0,
      maxBehavioralScore: 30,
      lastDepositDays: 30,
      chestType: '',
      bonusPercentage: 10,
      freeSpins: 0,
      active: true
    });
  };

  const editChest = (chest: ChestType) => {
    setEditingChest(chest);
    setChestForm({
      name: chest.name,
      color: chest.color,
      minValue: chest.minValue,
      maxValue: chest.maxValue,
      probability: chest.probability,
      directReferrals: chest.requirements.directReferrals,
      totalVolume: chest.requirements.totalVolume,
      behavioralScore: chest.requirements.behavioralScore,
      aiOptimization: chest.aiOptimization,
      active: chest.active
    });
    setIsChestDialogOpen(true);
  };

  const editCampaign = (campaign: ReactivationCampaign) => {
    setEditingCampaign(campaign);
    setCampaignForm({
      name: campaign.name,
      targetAudience: campaign.targetAudience,
      inactivityDays: campaign.triggers.inactivityDays,
      minBehavioralScore: campaign.triggers.minBehavioralScore,
      maxBehavioralScore: campaign.triggers.maxBehavioralScore,
      lastDepositDays: campaign.triggers.lastDepositDays,
      chestType: campaign.rewards.chestType,
      bonusPercentage: campaign.rewards.bonusPercentage,
      freeSpins: campaign.rewards.freeSpins,
      active: campaign.active
    });
    setIsCampaignDialogOpen(true);
  };

  const deleteChest = (id: string) => {
    setChestTypes(prev => prev.filter(chest => chest.id !== id));
    toast.success('Baú removido com sucesso');
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
    toast.success('Campanha removida com sucesso');
  };

  const getClassificationBadge = (classification: string) => {
    switch (classification) {
      case 'very_high':
        return <Badge className="bg-blue-500">Muito Alto</Badge>;
      case 'high':
        return <Badge className="bg-green-500">Alto</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Médio</Badge>;
      case 'low':
        return <Badge className="bg-red-500">Baixo</Badge>;
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
          <h2 className="text-3xl font-bold tracking-tight">Gamificação Avançada</h2>
          <p className="text-muted-foreground">
            Sistema completo de gamificação com IA e análise comportamental
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsChestDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Baú
          </Button>
          <Button 
            onClick={() => setIsCampaignDialogOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Campanha
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Baús Ativos</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chestTypes.filter(c => c.active).length}</div>
            <p className="text-xs text-muted-foreground">
              De {chestTypes.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.filter(c => c.active).length}</div>
            <p className="text-xs text-muted-foreground">
              Reativação automática
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(55)}`}>55</div>
            <p className="text-xs text-muted-foreground">
              Análise comportamental
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">18.5%</div>
            <p className="text-xs text-muted-foreground">
              Taxa de conversão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 11.3K</div>
            <p className="text-xs text-muted-foreground">
              Receita gerada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chests" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Baús de Recompensa
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Campanhas
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Análise Comportamental
          </TabsTrigger>
        </TabsList>

        {/* Chest Management Tab */}
        <TabsContent value="chests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Baús</CardTitle>
              <CardDescription>
                Configure tipos de baús, recompensas e requisitos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Baú</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Probabilidade</TableHead>
                    <TableHead>Requisitos</TableHead>
                    <TableHead>IA</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chestTypes.map((chest) => (
                    <TableRow key={chest.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: chest.color }}
                          />
                          <span className="font-medium">{chest.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        R$ {chest.minValue} - R$ {chest.maxValue}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={chest.probability * 100} className="w-16" />
                          <span className="text-sm">{(chest.probability * 100).toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Indicações: {chest.requirements.directReferrals}</div>
                          <div>Volume: R$ {chest.requirements.totalVolume}</div>
                          <div>Score: {chest.requirements.behavioralScore}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {chest.aiOptimization ? (
                          <Badge className="bg-purple-500">IA Ativa</Badge>
                        ) : (
                          <Badge variant="outline">Manual</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {chest.active ? (
                          <Badge className="bg-green-500">Ativo</Badge>
                        ) : (
                          <Badge variant="destructive">Inativo</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => editChest(chest)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteChest(chest.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campanhas de Reativação</CardTitle>
              <CardDescription>
                Campanhas automáticas baseadas em comportamento e IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campanha</TableHead>
                    <TableHead>Público-Alvo</TableHead>
                    <TableHead>Triggers</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div className="font-medium">{campaign.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {campaign.targetAudience.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Inatividade: {campaign.triggers.inactivityDays}d</div>
                          <div>Score: {campaign.triggers.minBehavioralScore}-{campaign.triggers.maxBehavioralScore}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Enviadas: {campaign.performance.sent}</div>
                          <div>Conversão: {((campaign.performance.converted / campaign.performance.sent) * 100).toFixed(1)}%</div>
                          <div>Revenue: R$ {campaign.performance.revenue}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {campaign.active ? (
                          <Badge className="bg-green-500">Ativa</Badge>
                        ) : (
                          <Badge variant="destructive">Inativa</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => editCampaign(campaign)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteCampaign(campaign.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavioral Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise Comportamental com IA</CardTitle>
              <CardDescription>
                Perfis de usuários analisados por machine learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Classificação</TableHead>
                    <TableHead>Padrões</TableHead>
                    <TableHead>Recomendações</TableHead>
                    <TableHead>Última Análise</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {behavioralData.map((data) => (
                    <TableRow key={data.userId}>
                      <TableCell className="font-mono">{data.userId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`text-lg font-bold ${getScoreColor(data.score)}`}>
                            {data.score}
                          </div>
                          <Progress value={data.score} className="w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {getClassificationBadge(data.classification)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Depósitos: {data.patterns.depositFrequency}</div>
                          <div>Apostas: {data.patterns.bettingPattern}</div>
                          <div>Sessões: {data.patterns.sessionDuration}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {data.recommendations.slice(0, 2).map((rec, index) => (
                            <div key={index}>• {rec}</div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {data.lastAnalysis.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Chest Dialog */}
      <Dialog open={isChestDialogOpen} onOpenChange={setIsChestDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingChest ? 'Editar Baú' : 'Novo Baú de Recompensa'}
            </DialogTitle>
            <DialogDescription>
              Configure as propriedades e requisitos do baú
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chest-name">Nome do Baú</Label>
                <Input
                  id="chest-name"
                  value={chestForm.name}
                  onChange={(e) => setChestForm({ ...chestForm, name: e.target.value })}
                  placeholder="Ex: Baú Ouro Premium"
                />
              </div>
              <div>
                <Label htmlFor="chest-color">Cor</Label>
                <Input
                  id="chest-color"
                  type="color"
                  value={chestForm.color}
                  onChange={(e) => setChestForm({ ...chestForm, color: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="min-value">Valor Mínimo (R$)</Label>
                <Input
                  id="min-value"
                  type="number"
                  value={chestForm.minValue}
                  onChange={(e) => setChestForm({ ...chestForm, minValue: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="max-value">Valor Máximo (R$)</Label>
                <Input
                  id="max-value"
                  type="number"
                  value={chestForm.maxValue}
                  onChange={(e) => setChestForm({ ...chestForm, maxValue: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="probability">Probabilidade</Label>
                <Input
                  id="probability"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={chestForm.probability}
                  onChange={(e) => setChestForm({ ...chestForm, probability: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="direct-referrals">Indicações Diretas</Label>
                <Input
                  id="direct-referrals"
                  type="number"
                  value={chestForm.directReferrals}
                  onChange={(e) => setChestForm({ ...chestForm, directReferrals: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="total-volume">Volume Total (R$)</Label>
                <Input
                  id="total-volume"
                  type="number"
                  value={chestForm.totalVolume}
                  onChange={(e) => setChestForm({ ...chestForm, totalVolume: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="behavioral-score">Score Comportamental</Label>
                <Input
                  id="behavioral-score"
                  type="number"
                  min="0"
                  max="100"
                  value={chestForm.behavioralScore}
                  onChange={(e) => setChestForm({ ...chestForm, behavioralScore: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="ai-optimization"
                  checked={chestForm.aiOptimization}
                  onCheckedChange={(checked) => setChestForm({ ...chestForm, aiOptimization: checked })}
                />
                <Label htmlFor="ai-optimization">Otimização por IA</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="chest-active"
                  checked={chestForm.active}
                  onCheckedChange={(checked) => setChestForm({ ...chestForm, active: checked })}
                />
                <Label htmlFor="chest-active">Ativo</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChestDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveChest}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign Dialog */}
      <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? 'Editar Campanha' : 'Nova Campanha de Reativação'}
            </DialogTitle>
            <DialogDescription>
              Configure os triggers e recompensas da campanha
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaign-name">Nome da Campanha</Label>
                <Input
                  id="campaign-name"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  placeholder="Ex: Reativação Score Baixo"
                />
              </div>
              <div>
                <Label htmlFor="target-audience">Público-Alvo</Label>
                <Select 
                  value={campaignForm.targetAudience} 
                  onValueChange={(value) => setCampaignForm({ ...campaignForm, targetAudience: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low_score">Score Baixo</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                    <SelectItem value="high_value">Alto Valor</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="inactivity-days">Dias Inativo</Label>
                <Input
                  id="inactivity-days"
                  type="number"
                  value={campaignForm.inactivityDays}
                  onChange={(e) => setCampaignForm({ ...campaignForm, inactivityDays: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="min-score">Score Mín</Label>
                <Input
                  id="min-score"
                  type="number"
                  min="0"
                  max="100"
                  value={campaignForm.minBehavioralScore}
                  onChange={(e) => setCampaignForm({ ...campaignForm, minBehavioralScore: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="max-score">Score Máx</Label>
                <Input
                  id="max-score"
                  type="number"
                  min="0"
                  max="100"
                  value={campaignForm.maxBehavioralScore}
                  onChange={(e) => setCampaignForm({ ...campaignForm, maxBehavioralScore: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="last-deposit">Último Depósito</Label>
                <Input
                  id="last-deposit"
                  type="number"
                  value={campaignForm.lastDepositDays}
                  onChange={(e) => setCampaignForm({ ...campaignForm, lastDepositDays: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="chest-type">Tipo de Baú</Label>
                <Select 
                  value={campaignForm.chestType} 
                  onValueChange={(value) => setCampaignForm({ ...campaignForm, chestType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um baú" />
                  </SelectTrigger>
                  <SelectContent>
                    {chestTypes.map((chest) => (
                      <SelectItem key={chest.id} value={chest.id}>
                        {chest.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bonus-percentage">Bônus (%)</Label>
                <Input
                  id="bonus-percentage"
                  type="number"
                  value={campaignForm.bonusPercentage}
                  onChange={(e) => setCampaignForm({ ...campaignForm, bonusPercentage: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="free-spins">Giros Grátis</Label>
                <Input
                  id="free-spins"
                  type="number"
                  value={campaignForm.freeSpins}
                  onChange={(e) => setCampaignForm({ ...campaignForm, freeSpins: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="campaign-active"
                checked={campaignForm.active}
                onCheckedChange={(checked) => setCampaignForm({ ...campaignForm, active: checked })}
              />
              <Label htmlFor="campaign-active">Campanha Ativa</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCampaignDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCampaign}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvancedGamificationManager;

