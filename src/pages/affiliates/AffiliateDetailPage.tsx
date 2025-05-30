import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { mockAffiliates, Affiliate } from "../../components/affiliates/AffiliateTable"; // Assuming mockAffiliates is exported
import { Edit2, ArrowLeft, Clock, DollarSign, Users, TrendingUp, FileText, ChevronDown, ChevronUp } from 'lucide-react';

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
        { id: 'DL001', name: 'Sub Afiliado 1.1', level: 1, deposited: 2500.00, commissionGenerated: 150.00 },
        { id: 'DL002', name: 'Sub Afiliado 1.2', level: 1, deposited: 3200.00, commissionGenerated: 200.00 },
        { id: 'DL005', name: 'Sub Afiliado 1.3', level: 1, deposited: 1800.00, commissionGenerated: 120.00 },
        { id: 'DL006', name: 'Sub Afiliado 1.4', level: 1, deposited: 4500.00, commissionGenerated: 280.00 },
        { id: 'DL007', name: 'Sub Afiliado 1.5', level: 1, deposited: 5000.00, commissionGenerated: 500.00 },
      ],
      'Nível 2': [
        { id: 'DL003', name: 'Sub Afiliado 2.1', level: 2, deposited: 1200.00, commissionGenerated: 50.00 },
        { id: 'DL008', name: 'Sub Afiliado 2.2', level: 2, deposited: 2300.00, commissionGenerated: 120.00 },
        { id: 'DL009', name: 'Sub Afiliado 2.3', level: 2, deposited: 3400.00, commissionGenerated: 180.00 },
        { id: 'DL010', name: 'Sub Afiliado 2.4', level: 2, deposited: 1500.00, commissionGenerated: 75.00 },
        { id: 'DL011', name: 'Sub Afiliado 2.5', level: 2, deposited: 2800.00, commissionGenerated: 140.00 },
      ],
      'Nível 3': [
        { id: 'DL012', name: 'Sub Afiliado 3.1', level: 3, deposited: 900.00, commissionGenerated: 45.00 },
        { id: 'DL013', name: 'Sub Afiliado 3.2', level: 3, deposited: 1800.00, commissionGenerated: 90.00 },
        { id: 'DL014', name: 'Sub Afiliado 3.3', level: 3, deposited: 2700.00, commissionGenerated: 135.00 },
        { id: 'DL015', name: 'Sub Afiliado 3.4', level: 3, deposited: 1500.00, commissionGenerated: 75.00 },
        { id: 'DL016', name: 'Sub Afiliado 3.5', level: 3, deposited: 2100.00, commissionGenerated: 105.00 },
      ],
      'Nível 4': [
        { id: 'DL017', name: 'Sub Afiliado 4.1', level: 4, deposited: 800.00, commissionGenerated: 40.00 },
        { id: 'DL018', name: 'Sub Afiliado 4.2', level: 4, deposited: 1600.00, commissionGenerated: 80.00 },
        { id: 'DL019', name: 'Sub Afiliado 4.3', level: 4, deposited: 1200.00, commissionGenerated: 60.00 },
        { id: 'DL020', name: 'Sub Afiliado 4.4', level: 4, deposited: 400.00, commissionGenerated: 20.00 },
      ],
      'Nível 5': [
        { id: 'DL021', name: 'Sub Afiliado 5.1', level: 5, deposited: 500.00, commissionGenerated: 25.00 },
        { id: 'DL022', name: 'Sub Afiliado 5.2', level: 5, deposited: 1000.00, commissionGenerated: 50.00 },
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
        { id: 'DL004', name: 'Sub Afiliado Outro 1.1', level: 1, deposited: 1500.00, commissionGenerated: 75.00 },
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

  // Filter downline details based on selected level
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
    
    return sortDownlineDetails(allDetails);
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
        commissionGenerated: totals.commissionGenerated + item.commissionGenerated
      };
    }, { deposited: 0, commissionGenerated: 0 });
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

  // Função para renderizar cards em telas pequenas
  const renderMobileCard = (item: any, idx: number) => (
    <div key={idx} className="bg-cinza-claro p-4 rounded-md mb-3 shadow-sm md:hidden">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-white">{item.name}</h4>
        <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">Nível {item.level}</span>
      </div>
      <div className="text-sm space-y-1">
        <p><span className="text-gray-400">ID:</span> {item.id}</p>
        <p><span className="text-gray-400">Valor Depositado:</span> R$ {item.deposited.toFixed(2)}</p>
        <p><span className="text-gray-400">Comissão Gerada:</span> R$ {item.commissionGenerated.toFixed(2)}</p>
      </div>
    </div>
  );

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
            <h2 className="text-xl font-semibold text-branco font-sora mb-4">Rede do Afiliado</h2>
            
            <h3 className="text-lg font-semibold text-branco mb-4">Contagem de Indicados por Nível:</h3>
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
                
                {/* Nível 1 Frame */}
                <div className="bg-cinza-escuro rounded-md overflow-hidden shadow-lg">
                    <div className="bg-azul-ciano py-2 px-3 text-center">
                        <h4 className="text-white font-semibold text-lg">Nível 1</h4>
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Indicações Totais:</span>
                            <span className="text-white font-semibold">{affiliateDownline.levels['Nível 1'] || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Indicações Validadas:</span>
                            <span className="text-white font-semibold">{affiliateDownline.validatedCounts['Nível 1'] || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Valor Depositado:</span>
                            <span className="text-white font-semibold">R$ {(affiliateDownline.depositedValues['Nível 1'] || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Comissão Total:</span>
                            <span className="text-white font-semibold">R$ {(affiliateDownline.commissions['Nível 1'] || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                {/* Nível 2 Frame */}
                <div className="bg-cinza-escuro rounded-md overflow-hidden shadow-lg">
                    <div className="bg-azul-ciano py-2 px-3 text-center">
                        <h4 className="text-white font-semibold text-lg">Nível 2</h4>
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Indicações Totais:</span>
                            <span className="text-white font-semibold">{affiliateDownline.levels['Nível 2'] || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Indicações Validadas:</span>
                            <span className="text-white font-semibold">{affiliateDownline.validatedCounts['Nível 2'] || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Valor Depositado:</span>
                            <span className="text-white font-semibold">R$ {(affiliateDownline.depositedValues['Nível 2'] || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Comissão Total:</span>
                            <span className="text-white font-semibold">R$ {(affiliateDownline.commissions['Nível 2'] || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                {/* Nível 3 Frame */}
                <div className="bg-cinza-escuro rounded-md overflow-hidden shadow-lg">
                    <div className="bg-azul-ciano py-2 px-3 text-center">
                        <h4 className="text-white font-semibold text-lg">Nível 3</h4>
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Indicações Totais:</span>
                            <span className="text-white font-semibold">{affiliateDownline.levels['Nível 3'] || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Indicações Validadas:</span>
                            <span className="text-white font-semibold">{affiliateDownline.validatedCounts['Nível 3'] || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Valor Depositado:</span>
                            <span className="text-white font-semibold">R$ {(affiliateDownline.depositedValues['Nível 3'] || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Comissão Total:</span>
                            <span className="text-white font-semibold">R$ {(affiliateDownline.commissions['Nível 3'] || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                {/* Nível 4 Frame */}
                <div className="bg-cinza-escuro rounded-md overflow-hidden shadow-lg">
                    <div className="bg-azul-ciano py-2 px-3 text-center">
                        <h4 className="text-white font-semibold text-lg">Nível 4</h4>
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Indicações Totais:</span>
                            <span className="text-white font-semibold">{affiliateDownline.levels['Nível 4'] || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Indicações Validadas:</span>
                            <span className="text-white font-semibold">{affiliateDownline.validatedCounts['Nível 4'] || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Valor Depositado:</span>
                            <span className="text-white font-semibold">R$ {(affiliateDownline.depositedValues['Nível 4'] || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Comissão Total:</span>
                            <span className="text-white font-semibold">R$ {(affiliateDownline.commissions['Nível 4'] || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                {/* Nível 5 Frame */}
                <div className="bg-cinza-escuro rounded-md overflow-hidden shadow-lg">
                    <div className="bg-azul-ciano py-2 px-3 text-center">
                        <h4 className="text-white font-semibold text-lg">Nível 5</h4>
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Indicações Totais:</span>
                            <span className="text-white font-semibold">{affiliateDownline.levels['Nível 5'] || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Indicações Validadas:</span>
                            <span className="text-white font-semibold">{affiliateDownline.validatedCounts['Nível 5'] || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Valor Depositado:</span>
                            <span className="text-white font-semibold">R$ {(affiliateDownline.depositedValues['Nível 5'] || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Comissão Total:</span>
                            <span className="text-white font-semibold">R$ {(affiliateDownline.commissions['Nível 5'] || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <h3 className="text-lg font-semibold text-branco mb-4">Detalhes da Downline:</h3>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
                <div className="flex items-center">
                    <label className="text-gray-400 mr-2 text-sm">Filtrar por Nível:</label>
                    <select 
                        className="bg-cinza-escuro text-branco border border-gray-600 rounded px-3 py-1 text-sm"
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
                <div className="flex items-center">
                    <label className="text-gray-400 mr-2 text-sm">Itens por página:</label>
                    <select 
                        className="bg-cinza-escuro text-branco border border-gray-600 rounded px-3 py-1 text-sm"
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
                    <div className="text-center py-4 text-gray-400">Nenhum afiliado encontrado.</div>
                }
                
                {/* Mobile Totals */}
                {filteredDownlineDetails.length > 0 && (
                    <div className="bg-gray-800 p-3 rounded-md mt-4">
                        <div className="font-semibold text-white mb-1">Total:</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-gray-400">Valor Depositado:</span>
                                <span className="text-white ml-1">R$ {totals.deposited.toFixed(2)}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Comissão Gerada:</span>
                                <span className="text-white ml-1">R$ {totals.commissionGenerated.toFixed(2)}</span>
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
                            <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('name')}>
                                <div className="flex items-center">
                                    NOME AFILIADO {getSortIndicator('name')}
                                </div>
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('id')}>
                                <div className="flex items-center">
                                    ID AFILIADO {getSortIndicator('id')}
                                </div>
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('level')}>
                                <div className="flex items-center">
                                    NÍVEL {getSortIndicator('level')}
                                </div>
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('deposited')}>
                                <div className="flex items-center">
                                    <span className="hidden lg:inline">VALOR DEPOSITADO PELA REDE DESSE AFILIADO</span>
                                    <span className="lg:hidden">VALOR DEPOSITADO</span>
                                    {getSortIndicator('deposited')}
                                </div>
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('commissionGenerated')}>
                                <div className="flex items-center">
                                    <span className="hidden lg:inline">COMISSÃO GERADA PELA REDE DESSE AFILIADO</span>
                                    <span className="lg:hidden">COMISSÃO GERADA</span>
                                    {getSortIndicator('commissionGenerated')}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedDetails.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-700 hover:bg-cinza-escuro">
                                <td className="px-4 py-2">{item.name}</td>
                                <td className="px-4 py-2 font-mono">{item.id}</td>
                                <td className="px-4 py-2">Nível {item.level}</td>
                                <td className="px-4 py-2">R$ {item.deposited.toFixed(2)}</td>
                                <td className="px-4 py-2">R$ {item.commissionGenerated.toFixed(2)}</td>
                            </tr>
                        ))}
                        {filteredDownlineDetails.length === 0 && 
                            <tr><td colSpan={5} className="text-center py-4 text-gray-400">Nenhum afiliado encontrado.</td></tr>
                        }
                    </tbody>
                    <tfoot className="bg-gray-800 font-semibold">
                        <tr>
                            <td colSpan={3} className="px-4 py-2 text-right">Total:</td>
                            <td className="px-4 py-2">R$ {totals.deposited.toFixed(2)}</td>
                            <td className="px-4 py-2">R$ {totals.commissionGenerated.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Pagination Controls - Responsivo */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-3 sm:space-y-0">
                    <div className="text-xs sm:text-sm text-gray-400 order-2 sm:order-1">
                        Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredDownlineDetails.length)} de {filteredDownlineDetails.length} resultados
                    </div>
                    <div className="flex space-x-1 order-1 sm:order-2">
                        <button 
                            onClick={() => handlePageChange(1)} 
                            disabled={currentPage === 1}
                            className={`px-2 sm:px-3 py-1 rounded text-sm ${currentPage === 1 ? 'bg-gray-700 text-gray-500' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                            &laquo;
                        </button>
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className={`px-2 sm:px-3 py-1 rounded text-sm ${currentPage === 1 ? 'bg-gray-700 text-gray-500' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                            &lsaquo;
                        </button>
                        
                        {/* Page numbers - Esconde em telas muito pequenas */}
                        <div className="hidden sm:flex space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                // Show pages around current page
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                
                                return (
                                    <button 
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)} 
                                        className={`px-3 py-1 rounded text-sm ${currentPage === pageNum ? 'bg-azul-ciano text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Página atual / total para telas pequenas */}
                        <span className="px-3 py-1 bg-gray-700 rounded text-white text-sm sm:hidden">
                            {currentPage}/{totalPages}
                        </span>
                        
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                            className={`px-2 sm:px-3 py-1 rounded text-sm ${currentPage === totalPages ? 'bg-gray-700 text-gray-500' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                            &rsaquo;
                        </button>
                        <button 
                            onClick={() => handlePageChange(totalPages)} 
                            disabled={currentPage === totalPages}
                            className={`px-2 sm:px-3 py-1 rounded text-sm ${currentPage === totalPages ? 'bg-gray-700 text-gray-500' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                            &raquo;
                        </button>
                    </div>
                </div>
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
                            <th className="px-4 py-2">Data</th><th className="px-4 py-2">Tipo</th><th className="px-4 py-2">Origem</th><th className="px-4 py-2">Valor (R$)</th><th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockCommissionHistory.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-700 hover:bg-cinza-escuro">
                                <td className="px-4 py-2">{item.date}</td><td className="px-4 py-2">{item.type}</td><td className="px-4 py-2">{item.origin}</td><td className="px-4 py-2">{item.value.toFixed(2)}</td><td><span className={`px-2 py-1 text-xs rounded-full ${item.status === 'Paga' ? 'bg-green-600' : 'bg-yellow-600'}`}>{item.status}</span></td>
                            </tr>
                        ))}
                        {mockCommissionHistory.length === 0 && <tr><td colSpan={5} className="text-center py-4 text-gray-400">Nenhum histórico de comissão.</td></tr>}
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
                            <th className="px-4 py-2">Data Solicitação</th><th className="px-4 py-2">Valor (R$)</th><th className="px-4 py-2">Método</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Última Atualização</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockWithdrawalHistory.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-700 hover:bg-cinza-escuro">
                                <td className="px-4 py-2">{item.dateRequested}</td><td className="px-4 py-2">{item.value.toFixed(2)}</td><td className="px-4 py-2">{item.method}</td><td><span className={`px-2 py-1 text-xs rounded-full ${item.status === 'Pago' || item.status === 'Aprovado' ? 'bg-green-600' : 'bg-yellow-600'}`}>{item.status}</span></td><td className="px-4 py-2">{item.lastUpdate}</td>
                            </tr>
                        ))}
                        {mockWithdrawalHistory.length === 0 && <tr><td colSpan={5} className="text-center py-4 text-gray-400">Nenhum histórico de saque.</td></tr>}
                    </tbody>
                </table>
            </div>
          </div>
        )}
        {activeTab === 'activity' && (
          <div>
            <h2 className="text-xl font-semibold text-branco font-sora mb-4">Atividade Recente</h2>
            <ul className="space-y-2 text-sm">
                {mockActivityLog.map((log, idx) => (
                    <li key={idx} className="p-2 bg-cinza-escuro rounded"><span className="text-gray-400">[{log.date}]</span> {log.activity}</li>
                ))}
                {mockActivityLog.length === 0 && <li className="text-center py-4 text-gray-400">Nenhuma atividade recente.</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateDetailPage;
