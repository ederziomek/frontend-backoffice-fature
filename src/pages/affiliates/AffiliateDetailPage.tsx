import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { mockAffiliates, Affiliate } from "../../components/affiliates/AffiliateTable"; // Assuming mockAffiliates is exported
import { Edit2, ArrowLeft, Clock, DollarSign, Users, TrendingUp, FileText, ChevronDown, ChevronUp, Download, Filter, Eye, BarChart3, Network, Search } from 'lucide-react';

// Mock data for downline and history - in a real app, this would be fetched
const mockDownline = {
  'AF001': {
    levels: { 
      'Nível 1': 5, 
      'Nível 2': 15, 
      'Nível 3': 30,
      'Nível 4': 45,
      'Nível 5': 22
    },
    validatedCounts: {
      'Nível 1': 4,
      'Nível 2': 12,
      'Nível 3': 25,
      'Nível 4': 38,
      'Nível 5': 18
    },
    depositedValues: {
      'Nível 1': 17000.00,
      'Nível 2': 11200.00,
      'Nível 3': 9000.00,
      'Nível 4': 4000.00,
      'Nível 5': 1500.00
    },
    commissions: {
      'Nível 1': 1250.00,
      'Nível 2': 850.00,
      'Nível 3': 450.00,
      'Nível 4': 200.00,
      'Nível 5': 75.00
    },
    levelDetails: {
      'Nível 1': [
        { id: 'DL001', name: 'Sub Afiliado 1.1', level: 1, deposited: 2500.00, commissionGenerated: 150.00, status: 'Ativo', registrationDate: '2024-01-15', lastActivity: '2024-05-10', totalReferrals: 3, validatedReferrals: 2 },
        { id: 'DL002', name: 'Sub Afiliado 1.2', level: 1, deposited: 3200.00, commissionGenerated: 200.00, status: 'Ativo', registrationDate: '2024-02-20', lastActivity: '2024-05-09', totalReferrals: 5, validatedReferrals: 4 },
        { id: 'DL005', name: 'Sub Afiliado 1.3', level: 1, deposited: 1800.00, commissionGenerated: 120.00, status: 'Inativo', registrationDate: '2024-03-10', lastActivity: '2024-04-15', totalReferrals: 2, validatedReferrals: 1 },
        { id: 'DL006', name: 'Sub Afiliado 1.4', level: 1, deposited: 4500.00, commissionGenerated: 280.00, status: 'Ativo', registrationDate: '2024-01-05', lastActivity: '2024-05-11', totalReferrals: 8, validatedReferrals: 6 },
        { id: 'DL007', name: 'Sub Afiliado 1.5', level: 1, deposited: 5000.00, commissionGenerated: 500.00, status: 'Ativo', registrationDate: '2024-01-20', lastActivity: '2024-05-11', totalReferrals: 12, validatedReferrals: 10 },
      ],
      'Nível 2': [
        { id: 'DL003', name: 'Sub Afiliado 2.1', level: 2, deposited: 1200.00, commissionGenerated: 50.00, status: 'Ativo', registrationDate: '2024-02-01', lastActivity: '2024-05-08', totalReferrals: 1, validatedReferrals: 1 },
        { id: 'DL008', name: 'Sub Afiliado 2.2', level: 2, deposited: 2300.00, commissionGenerated: 120.00, status: 'Ativo', registrationDate: '2024-02-15', lastActivity: '2024-05-10', totalReferrals: 3, validatedReferrals: 2 },
        { id: 'DL009', name: 'Sub Afiliado 2.3', level: 2, deposited: 3400.00, commissionGenerated: 180.00, status: 'Ativo', registrationDate: '2024-03-01', lastActivity: '2024-05-09', totalReferrals: 4, validatedReferrals: 3 },
        { id: 'DL010', name: 'Sub Afiliado 2.4', level: 2, deposited: 1500.00, commissionGenerated: 75.00, status: 'Pendente', registrationDate: '2024-03-20', lastActivity: '2024-04-20', totalReferrals: 2, validatedReferrals: 1 },
        { id: 'DL011', name: 'Sub Afiliado 2.5', level: 2, deposited: 2800.00, commissionGenerated: 140.00, status: 'Ativo', registrationDate: '2024-02-28', lastActivity: '2024-05-11', totalReferrals: 5, validatedReferrals: 4 },
      ],
      'Nível 3': [
        { id: 'DL012', name: 'Sub Afiliado 3.1', level: 3, deposited: 900.00, commissionGenerated: 45.00, status: 'Ativo', registrationDate: '2024-03-15', lastActivity: '2024-05-05', totalReferrals: 1, validatedReferrals: 1 },
        { id: 'DL013', name: 'Sub Afiliado 3.2', level: 3, deposited: 1800.00, commissionGenerated: 90.00, status: 'Ativo', registrationDate: '2024-03-25', lastActivity: '2024-05-08', totalReferrals: 2, validatedReferrals: 2 },
        { id: 'DL014', name: 'Sub Afiliado 3.3', level: 3, deposited: 2700.00, commissionGenerated: 135.00, status: 'Ativo', registrationDate: '2024-04-01', lastActivity: '2024-05-10', totalReferrals: 3, validatedReferrals: 2 },
        { id: 'DL015', name: 'Sub Afiliado 3.4', level: 3, deposited: 1500.00, commissionGenerated: 75.00, status: 'Inativo', registrationDate: '2024-04-10', lastActivity: '2024-04-25', totalReferrals: 1, validatedReferrals: 0 },
        { id: 'DL016', name: 'Sub Afiliado 3.5', level: 3, deposited: 2100.00, commissionGenerated: 105.00, status: 'Ativo', registrationDate: '2024-04-05', lastActivity: '2024-05-09', totalReferrals: 2, validatedReferrals: 2 },
      ],
      'Nível 4': [
        { id: 'DL017', name: 'Sub Afiliado 4.1', level: 4, deposited: 800.00, commissionGenerated: 40.00, status: 'Ativo', registrationDate: '2024-04-15', lastActivity: '2024-05-07', totalReferrals: 1, validatedReferrals: 1 },
        { id: 'DL018', name: 'Sub Afiliado 4.2', level: 4, deposited: 1600.00, commissionGenerated: 80.00, status: 'Ativo', registrationDate: '2024-04-20', lastActivity: '2024-05-10', totalReferrals: 2, validatedReferrals: 1 },
        { id: 'DL019', name: 'Sub Afiliado 4.3', level: 4, deposited: 1200.00, commissionGenerated: 60.00, status: 'Pendente', registrationDate: '2024-04-25', lastActivity: '2024-05-01', totalReferrals: 1, validatedReferrals: 0 },
        { id: 'DL020', name: 'Sub Afiliado 4.4', level: 4, deposited: 400.00, commissionGenerated: 20.00, status: 'Inativo', registrationDate: '2024-05-01', lastActivity: '2024-05-02', totalReferrals: 0, validatedReferrals: 0 },
      ],
      'Nível 5': [
        { id: 'DL021', name: 'Sub Afiliado 5.1', level: 5, deposited: 500.00, commissionGenerated: 25.00, status: 'Ativo', registrationDate: '2024-05-01', lastActivity: '2024-05-08', totalReferrals: 1, validatedReferrals: 0 },
        { id: 'DL022', name: 'Sub Afiliado 5.2', level: 5, deposited: 1000.00, commissionGenerated: 50.00, status: 'Ativo', registrationDate: '2024-05-05', lastActivity: '2024-05-10', totalReferrals: 1, validatedReferrals: 1 },
      ]
    }
  },
  'AF002': {
    levels: { 'Nível 1': 2 },
    validatedCounts: { 'Nível 1': 1 },
    depositedValues: { 'Nível 1': 1500.00 },
    commissions: { 'Nível 1': 75.00 },
    levelDetails: {
      'Nível 1': [
        { id: 'DL004', name: 'Sub Afiliado Outro 1.1', level: 1, deposited: 1500.00, commissionGenerated: 75.00, status: 'Ativo', registrationDate: '2024-03-01', lastActivity: '2024-05-05', totalReferrals: 0, validatedReferrals: 0 },
      ]
    }
  }
  // Add more mock downline data as needed
};

const mockCommissionHistory = [
  { date: '2024-05-01', type: 'RevShare', origin: 'Jogador X', value: 50.75, status: 'Paga' },
  { date: '2024-04-20', type: 'CPA', origin: 'Jogador Y', value: 100.00, status: 'Paga' },
  { date: '2024-04-10', type: 'Bônus', origin: 'Campanha Z', value: 25.00, status: 'Pendente' },
];

const mockWithdrawalHistory = [
  { dateRequested: '2024-05-05', value: 250.00, method: 'PIX', status: 'Aprovado', lastUpdate: '2024-05-06' },
  { dateRequested: '2024-04-15', value: 150.00, method: 'Transferência', status: 'Pago', lastUpdate: '2024-04-18' },
];

const mockActivityLog = [
  { date: '2024-05-09 10:00', activity: 'Login na plataforma.' },
  { date: '2024-05-08 15:30', activity: 'Dados bancários atualizados.' },
  { date: '2024-05-01 00:00', activity: 'Atingiu Nível Profissional.' },
];

const AffiliateDetailPage: React.FC = () => {
  const { affiliateId } = useParams<{ affiliateId: string }>();
  // const navigate = useNavigate(); // Commented out as unused
  const [affiliate, setAffiliate] = useState<Affiliate | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'details' | 'network' | 'commissions' | 'withdrawals' | 'activity'>('network');
  const [selectedLevel, setSelectedLevel] = useState<string>('Todos');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('Todos');
  const [viewMode, setViewMode] = useState<'table' | 'hierarchy'>('table');
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'ascending' | 'descending'}>({
    key: 'name',
    direction: 'ascending'
  });
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (affiliateId) {
      const foundAffiliate = mockAffiliates.find((aff: Affiliate) => aff.id === affiliateId);
      setAffiliate(foundAffiliate);
    }
  }, [affiliateId]);

  if (!affiliate) {
    return <div className="text-center text-branco p-10">Afiliado não encontrado. <Link to="/affiliates" className="text-azul-ciano hover:underline">Voltar para a lista</Link></div>;
  }

  const getStatusColor = (status: Affiliate['status']) => {
    switch (status) {
      case 'Ativo': return 'bg-green-700 text-green-100';
      case 'Inativo': return 'bg-gray-600 text-gray-100';
      case 'Pendente': return 'bg-yellow-600 text-yellow-100';
      case 'Bloqueado': return 'bg-red-700 text-red-100';
      default: return 'bg-gray-500 text-gray-100';
    }
  };

  const affiliateDownline = (mockDownline as any)[affiliate.id] || { 
    levels: {}, 
    validatedCounts: {},
    depositedValues: {},
    commissions: {},
    levelDetails: {} 
  };

  // Calculate totals for all levels
  const calculateAllLevelsTotals = () => {
    const levels = Object.keys(affiliateDownline.levels);
    
    return {
      totalCount: levels.reduce((sum, level) => sum + (affiliateDownline.levels[level] || 0), 0),
      totalValidated: levels.reduce((sum, level) => sum + (affiliateDownline.validatedCounts[level] || 0), 0),
      totalDeposited: levels.reduce((sum, level) => sum + (affiliateDownline.depositedValues[level] || 0), 0),
      totalCommission: levels.reduce((sum, level) => sum + (affiliateDownline.commissions[level] || 0), 0)
    };
  };

  const allLevelsTotals = calculateAllLevelsTotals();

  // Filter downline details based on selected level, status, search term, and date
  const getFilteredDownlineDetails = () => {
    let allDetails: any[] = [];
    
    if (selectedLevel === 'Todos') {
      // Combine all levels
      Object.values(affiliateDownline.levelDetails).forEach((details: any) => {
        allDetails = [...allDetails, ...details];
      });
    } else {
      // Get specific level
      allDetails = affiliateDownline.levelDetails[selectedLevel] || [];
    }
    
    // Apply filters
    let filteredDetails = allDetails;
    
    // Status filter
    if (statusFilter !== 'Todos') {
      filteredDetails = filteredDetails.filter(item => item.status === statusFilter);
    }
    
    // Search filter
    if (searchTerm) {
      filteredDetails = filteredDetails.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Date filter
    if (dateFilter !== 'Todos') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'Últimos 7 dias':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'Últimos 30 dias':
          filterDate.setDate(now.getDate() - 30);
          break;
        case 'Últimos 90 dias':
          filterDate.setDate(now.getDate() - 90);
          break;
      }
      
      filteredDetails = filteredDetails.filter(item => 
        new Date(item.registrationDate) >= filterDate
      );
    }
    
    return sortDownlineDetails(filteredDetails);
  };

  // Sort downline details based on sort configuration
  const sortDownlineDetails = (details: any[]) => {
    return [...details].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Handle sort request
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Calculate totals for the filtered downline details
  const calculateTotals = (details: any[]) => {
    return details.reduce((totals, item) => {
      return {
        deposited: totals.deposited + item.deposited,
        commissionGenerated: totals.commissionGenerated + item.commissionGenerated,
        totalReferrals: totals.totalReferrals + item.totalReferrals,
        validatedReferrals: totals.validatedReferrals + item.validatedReferrals
      };
    }, { deposited: 0, commissionGenerated: 0, totalReferrals: 0, validatedReferrals: 0 });
  };

  const filteredDownlineDetails = getFilteredDownlineDetails();
  const totals = calculateTotals(filteredDownlineDetails);

  // Pagination logic
  const totalPages = Math.ceil(filteredDownlineDetails.length / itemsPerPage);
  const paginatedDetails = filteredDownlineDetails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Get sort indicator
  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  // Export data function
  const exportData = () => {
    const csvContent = [
      ['Nome', 'ID', 'Nível', 'Status', 'Data Cadastro', 'Última Atividade', 'Valor Depositado', 'Comissão Gerada', 'Total Indicações', 'Indicações Validadas'],
      ...filteredDownlineDetails.map(item => [
        item.name,
        item.id,
        `Nível ${item.level}`,
        item.status,
        item.registrationDate,
        item.lastActivity,
        `R$ ${item.deposited.toFixed(2)}`,
        `R$ ${item.commissionGenerated.toFixed(2)}`,
        item.totalReferrals,
        item.validatedReferrals
      ])
    ].map(row => row.join(',')).join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rede_${affiliate.name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedLevel('Todos');
    setStatusFilter('Todos');
    setSearchTerm('');
    setDateFilter('Todos');
    setCurrentPage(1);
  };

  // Função para renderizar cards em telas pequenas
  const renderMobileCard = (item: any, idx: number) => (
    <div key={idx} className="bg-cinza-claro p-4 rounded-md mb-3 shadow-sm md:hidden">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-white">{item.name}</h4>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">Nível {item.level}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
            {item.status}
          </span>
        </div>
      </div>
      <div className="text-sm space-y-1">
        <p><span className="text-gray-400">ID:</span> {item.id}</p>
        <p><span className="text-gray-400">Valor Depositado:</span> R$ {item.deposited.toFixed(2)}</p>
        <p><span className="text-gray-400">Comissão Gerada:</span> R$ {item.commissionGenerated.toFixed(2)}</p>
        <p><span className="text-gray-400">Indicações:</span> {item.validatedReferrals}/{item.totalReferrals}</p>
        <p><span className="text-gray-400">Última Atividade:</span> {item.lastActivity}</p>
      </div>
    </div>
  );

  // Render hierarchy view
  const renderHierarchyView = () => {
    const levels = ['Nível 1', 'Nível 2', 'Nível 3', 'Nível 4', 'Nível 5'];
    
    return (
      <div className="space-y-6">
        {levels.map(level => {
          const levelData = affiliateDownline.levelDetails[level] || [];
          if (levelData.length === 0) return null;
          
          return (
            <div key={level} className="bg-cinza-escuro p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-azul-ciano flex items-center">
                  <Network size={20} className="mr-2" />
                  {level} ({levelData.length} afiliados)
                </h4>
                <div className="text-sm text-gray-400">
                  Total Depositado: R$ {(affiliateDownline.depositedValues[level] || 0).toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {levelData.map((item: any, idx: number) => (
                  <div key={idx} className="bg-gray-800 p-3 rounded border-l-4 border-azul-ciano">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-white">{item.name}</h5>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <p>ID: {item.id}</p>
                      <p>Depositado: R$ {item.deposited.toFixed(2)}</p>
                      <p>Comissão: R$ {item.commissionGenerated.toFixed(2)}</p>
                      <p>Indicações: {item.validatedReferrals}/{item.totalReferrals}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-cinza-escuro p-1 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
            <Link to="/affiliates" className="flex items-center text-sm text-azul-ciano hover:text-opacity-80 mb-2">
                <ArrowLeft size={18} className="mr-1" />
                Voltar para Lista de Afiliados
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-branco font-sora">Detalhes do Afiliado</h1>
        </div>
        <div className="flex gap-2 mt-3 sm:mt-0">
          <Link 
            to={`/affiliates/edit/${affiliate.id}`}
            className="px-3 py-2 sm:px-4 sm:py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80 flex items-center"
          >
            <Edit2 size={16} className="mr-2" /> Editar Afiliado
          </Link>
        </div>
      </div>

      {/* Affiliate Quick Info Bar */}
      <div className="bg-cinza-claro p-4 sm:p-6 rounded-lg shadow-lg mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div>
                <p className="text-sm text-gray-400">Nome</p>
                <p className="text-lg sm:text-xl font-semibold text-branco">{affiliate.name}</p>
            </div>
            <div>
                <p className="text-sm text-gray-400">ID do Afiliado</p>
                <p className="text-base sm:text-lg font-mono text-gray-300">{affiliate.id}</p>
            </div>
            <div>
                <p className="text-sm text-gray-400">Status</p>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(affiliate.status)}`}>
                    {affiliate.status}
                </span>
            </div>
            <div>
                <p className="text-sm text-gray-400">Categoria/Level</p>
                <p className="text-base sm:text-lg text-branco">{affiliate.category}</p>
            </div>
        </div>
      </div>

      {/* Tabs Navigation - Scrollable em telas pequenas */}
      <div className="mb-6 border-b border-gray-700 overflow-x-auto">
        <nav className="-mb-px flex space-x-2 sm:space-x-4 min-w-max" aria-label="Tabs">
          {[
            { key: 'details', label: 'Dados Cadastrais', icon: FileText },
            { key: 'network', label: 'Rede', icon: Users },
            { key: 'commissions', label: 'Hist. Comissões', icon: DollarSign },
            { key: 'withdrawals', label: 'Hist. Saques', icon: TrendingUp },
            { key: 'activity', label: 'Atividade Recente', icon: Clock },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center 
                ${activeTab === tab.key 
                  ? 'border-azul-ciano text-azul-ciano'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
            >
              <tab.icon size={16} className="mr-1 sm:mr-2"/> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-cinza-claro p-4 sm:p-6 rounded-lg shadow-lg min-h-[300px]">
        {activeTab === 'details' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-branco font-sora mb-3">Informações Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <p><strong className="text-gray-400">E-mail:</strong> {affiliate.email}</p>
                <p><strong className="text-gray-400">Telefone:</strong> {affiliate.phone}</p>
                <p><strong className="text-gray-400">CPF:</strong> {affiliate.cpf}</p>
                <p><strong className="text-gray-400">Data de Cadastro:</strong> {affiliate.registrationDate}</p>
                <p><strong className="text-gray-400">Upline:</strong> {affiliate.upline || 'N/A'}</p>
                {/* Add more fields as per AffiliateFormPage: CNPJ, Nome Empresa, Endereço, Dados Bancários */}
                <p><strong className="text-gray-400">CNPJ:</strong> {(affiliate as any).cnpj || 'Não informado'}</p>
                <p><strong className="text-gray-400">Nome da Empresa:</strong> {(affiliate as any).companyName || 'Não informado'}</p>
                <p className="md:col-span-2"><strong className="text-gray-400">Endereço:</strong> {(affiliate as any).address || 'Não informado'}</p>
                <p className="md:col-span-2"><strong className="text-gray-400">Dados Bancários:</strong> {(affiliate as any).bankDetails || 'Não informado'}</p>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-semibold text-branco font-sora mb-4 sm:mb-0">Rede do Afiliado</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'table' ? 'hierarchy' : 'table')}
                  className="px-3 py-2 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-600 flex items-center"
                >
                  {viewMode === 'table' ? <Network size={16} className="mr-1" /> : <BarChart3 size={16} className="mr-1" />}
                  {viewMode === 'table' ? 'Visão Hierárquica' : 'Visão Tabela'}
                </button>
                <button
                  onClick={exportData}
                  className="px-3 py-2 text-sm bg-azul-ciano text-white rounded-md hover:bg-opacity-80 flex items-center"
                >
                  <Download size={16} className="mr-1" />
                  Exportar
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-branco mb-4">Resumo por Nível:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {/* Todas Indicações Frame */}
                <div className="bg-cinza-escuro rounded-md overflow-hidden shadow-lg">
                    <div className="bg-azul-ciano py-2 px-3 text-center">
                        <h4 className="text-white font-semibold text-lg">Todas Indicações</h4>
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Indicações Totais:</span>
                            <span className="text-white font-semibold">{allLevelsTotals.totalCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Indicações Validadas:</span>
                            <span className="text-white font-semibold">{allLevelsTotals.totalValidated}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Valor Depositado:</span>
                            <span className="text-white font-semibold">R$ {allLevelsTotals.totalDeposited.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Comissão Total:</span>
                            <span className="text-white font-semibold">R$ {allLevelsTotals.totalCommission.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                {/* Níveis 1-5 Frames */}
                {[1, 2, 3, 4, 5].map(levelNum => (
                  <div key={levelNum} className="bg-cinza-escuro rounded-md overflow-hidden shadow-lg">
                      <div className="bg-azul-ciano py-2 px-3 text-center">
                          <h4 className="text-white font-semibold text-lg">Nível {levelNum}</h4>
                      </div>
                      <div className="p-4 space-y-2">
                          <div className="flex justify-between">
                              <span className="text-gray-400 text-sm">Indicações Totais:</span>
                              <span className="text-white font-semibold">{affiliateDownline.levels[`Nível ${levelNum}`] || 0}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-gray-400 text-sm">Indicações Validadas:</span>
                              <span className="text-white font-semibold">{affiliateDownline.validatedCounts[`Nível ${levelNum}`] || 0}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-gray-400 text-sm">Valor Depositado:</span>
                              <span className="text-white font-semibold">R$ {(affiliateDownline.depositedValues[`Nível ${levelNum}`] || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-gray-400 text-sm">Comissão Total:</span>
                              <span className="text-white font-semibold">R$ {(affiliateDownline.commissions[`Nível ${levelNum}`] || 0).toFixed(2)}</span>
                          </div>
                      </div>
                  </div>
                ))}
            </div>

            {viewMode === 'hierarchy' ? (
              renderHierarchyView()
            ) : (
              <>
                <h3 className="text-lg font-semibold text-branco mb-4">Detalhes da Downline:</h3>
                
                {/* Advanced Filters */}
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-semibold text-white flex items-center">
                      <Filter size={18} className="mr-2" />
                      Filtros Avançados
                    </h4>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-azul-ciano hover:text-opacity-80"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">Buscar:</label>
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Nome ou ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 bg-cinza-escuro text-branco border border-gray-600 rounded text-sm focus:border-azul-ciano outline-none"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">Nível:</label>
                      <select 
                        className="w-full bg-cinza-escuro text-branco border border-gray-600 rounded px-3 py-2 text-sm focus:border-azul-ciano outline-none"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                      >
                        <option value="Todos">Todos os Níveis</option>
                        <option value="Nível 1">Nível 1</option>
                        <option value="Nível 2">Nível 2</option>
                        <option value="Nível 3">Nível 3</option>
                        <option value="Nível 4">Nível 4</option>
                        <option value="Nível 5">Nível 5</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">Status:</label>
                      <select 
                        className="w-full bg-cinza-escuro text-branco border border-gray-600 rounded px-3 py-2 text-sm focus:border-azul-ciano outline-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="Todos">Todos os Status</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Bloqueado">Bloqueado</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">Período de Cadastro:</label>
                      <select 
                        className="w-full bg-cinza-escuro text-branco border border-gray-600 rounded px-3 py-2 text-sm focus:border-azul-ciano outline-none"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                      >
                        <option value="Todos">Todos os Períodos</option>
                        <option value="Últimos 7 dias">Últimos 7 dias</option>
                        <option value="Últimos 30 dias">Últimos 30 dias</option>
                        <option value="Últimos 90 dias">Últimos 90 dias</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
                    <div className="text-sm text-gray-400">
                      Mostrando {paginatedDetails.length} de {filteredDownlineDetails.length} afiliados
                      {filteredDownlineDetails.length !== Object.values(affiliateDownline.levelDetails).flat().length && 
                        ` (${Object.values(affiliateDownline.levelDetails).flat().length} total)`
                      }
                    </div>
                    <div className="flex items-center">
                        <label className="text-gray-400 mr-2 text-sm">Itens por página:</label>
                        <select 
                            className="bg-cinza-escuro text-branco border border-gray-600 rounded px-3 py-1 text-sm focus:border-azul-ciano outline-none"
                            value={itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
                
                {/* Mobile Cards View */}
                <div className="md:hidden space-y-2 mb-4">
                    {paginatedDetails.map((item, idx) => renderMobileCard(item, idx))}
                    {filteredDownlineDetails.length === 0 && 
                        <div className="text-center py-8 text-gray-400">
                          <Users size={48} className="mx-auto mb-2 opacity-50" />
                          <p>Nenhum afiliado encontrado com os filtros aplicados.</p>
                        </div>
                    }
                    
                    {/* Mobile Totals */}
                    {filteredDownlineDetails.length > 0 && (
                        <div className="bg-gray-800 p-3 rounded-md mt-4">
                            <div className="font-semibold text-white mb-2">Totais dos Resultados Filtrados:</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-gray-400">Valor Depositado:</span>
                                    <span className="text-white ml-1">R$ {totals.deposited.toFixed(2)}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Comissão Gerada:</span>
                                    <span className="text-white ml-1">R$ {totals.commissionGenerated.toFixed(2)}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Total Indicações:</span>
                                    <span className="text-white ml-1">{totals.totalReferrals}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Indicações Validadas:</span>
                                    <span className="text-white ml-1">{totals.validatedReferrals}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-branco">
                        <thead className="bg-gray-700 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('name')}>
                                    <div className="flex items-center">
                                        NOME AFILIADO {getSortIndicator('name')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('id')}>
                                    <div className="flex items-center">
                                        ID AFILIADO {getSortIndicator('id')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('level')}>
                                    <div className="flex items-center">
                                        NÍVEL {getSortIndicator('level')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('status')}>
                                    <div className="flex items-center">
                                        STATUS {getSortIndicator('status')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('registrationDate')}>
                                    <div className="flex items-center">
                                        DATA CADASTRO {getSortIndicator('registrationDate')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('lastActivity')}>
                                    <div className="flex items-center">
                                        ÚLTIMA ATIVIDADE {getSortIndicator('lastActivity')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('deposited')}>
                                    <div className="flex items-center">
                                        VALOR DEPOSITADO {getSortIndicator('deposited')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('commissionGenerated')}>
                                    <div className="flex items-center">
                                        COMISSÃO GERADA {getSortIndicator('commissionGenerated')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('totalReferrals')}>
                                    <div className="flex items-center">
                                        INDICAÇÕES {getSortIndicator('totalReferrals')}
                                    </div>
                                </th>
                                <th className="px-4 py-3">
                                    AÇÕES
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDetails.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-700 hover:bg-cinza-escuro">
                                    <td className="px-4 py-3 font-medium">{item.name}</td>
                                    <td className="px-4 py-3 font-mono text-gray-300">{item.id}</td>
                                    <td className="px-4 py-3">
                                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                                        Nível {item.level}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(item.status)}`}>
                                        {item.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-300">{item.registrationDate}</td>
                                    <td className="px-4 py-3 text-gray-300">{item.lastActivity}</td>
                                    <td className="px-4 py-3 font-semibold">R$ {item.deposited.toFixed(2)}</td>
                                    <td className="px-4 py-3 font-semibold text-green-400">R$ {item.commissionGenerated.toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                      <span className="text-green-400">{item.validatedReferrals}</span>
                                      <span className="text-gray-400">/{item.totalReferrals}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                      <button className="text-azul-ciano hover:text-opacity-80 p-1">
                                        <Eye size={16} />
                                      </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredDownlineDetails.length === 0 && 
                                <tr>
                                  <td colSpan={10} className="text-center py-8 text-gray-400">
                                    <Users size={48} className="mx-auto mb-2 opacity-50" />
                                    <p>Nenhum afiliado encontrado com os filtros aplicados.</p>
                                  </td>
                                </tr>
                            }
                        </tbody>
                        {filteredDownlineDetails.length > 0 && (
                          <tfoot className="bg-gray-800">
                            <tr className="font-semibold">
                              <td colSpan={6} className="px-4 py-3 text-right">TOTAIS:</td>
                              <td className="px-4 py-3">R$ {totals.deposited.toFixed(2)}</td>
                              <td className="px-4 py-3 text-green-400">R$ {totals.commissionGenerated.toFixed(2)}</td>
                              <td className="px-4 py-3">
                                <span className="text-green-400">{totals.validatedReferrals}</span>
                                <span className="text-gray-400">/{totals.totalReferrals}</span>
                              </td>
                              <td className="px-4 py-3"></td>
                            </tr>
                          </tfoot>
                        )}
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
                    <div className="text-sm text-gray-400">
                      Página {currentPage} de {totalPages}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                      >
                        Primeira
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                      >
                        Anterior
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        if (pageNum <= totalPages) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-1 text-sm rounded ${
                                currentPage === pageNum
                                  ? 'bg-azul-ciano text-white'
                                  : 'bg-gray-700 text-white hover:bg-gray-600'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        return null;
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                      >
                        Próxima
                      </button>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                      >
                        Última
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'commissions' && (
          <div>
            <h2 className="text-xl font-semibold text-branco font-sora mb-4">Histórico de Comissões</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-branco">
                <thead className="bg-gray-700 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-2">Data</th>
                    <th className="px-4 py-2">Tipo</th>
                    <th className="px-4 py-2">Origem</th>
                    <th className="px-4 py-2">Valor</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCommissionHistory.map((commission, idx) => (
                    <tr key={idx} className="border-b border-gray-700">
                      <td className="px-4 py-2">{commission.date}</td>
                      <td className="px-4 py-2">{commission.type}</td>
                      <td className="px-4 py-2">{commission.origin}</td>
                      <td className="px-4 py-2">R$ {commission.value.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          commission.status === 'Paga' ? 'bg-green-700 text-green-100' : 'bg-yellow-600 text-yellow-100'
                        }`}>
                          {commission.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div>
            <h2 className="text-xl font-semibold text-branco font-sora mb-4">Histórico de Saques</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-branco">
                <thead className="bg-gray-700 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-2">Data Solicitação</th>
                    <th className="px-4 py-2">Valor</th>
                    <th className="px-4 py-2">Método</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Última Atualização</th>
                  </tr>
                </thead>
                <tbody>
                  {mockWithdrawalHistory.map((withdrawal, idx) => (
                    <tr key={idx} className="border-b border-gray-700">
                      <td className="px-4 py-2">{withdrawal.dateRequested}</td>
                      <td className="px-4 py-2">R$ {withdrawal.value.toFixed(2)}</td>
                      <td className="px-4 py-2">{withdrawal.method}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          withdrawal.status === 'Pago' ? 'bg-green-700 text-green-100' : 'bg-blue-600 text-blue-100'
                        }`}>
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{withdrawal.lastUpdate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div>
            <h2 className="text-xl font-semibold text-branco font-sora mb-4">Atividade Recente</h2>
            <div className="space-y-3">
              {mockActivityLog.map((activity, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 bg-cinza-escuro rounded-md">
                  <Clock size={16} className="text-azul-ciano mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-branco">{activity.activity}</p>
                    <p className="text-xs text-gray-400">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateDetailPage;

