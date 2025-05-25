import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { mockAffiliates, Affiliate } from "../../components/affiliates/AffiliateTable"; // Assuming mockAffiliates is exported
import { Edit2, ArrowLeft, Clock, DollarSign, Users, TrendingUp, FileText } from 'lucide-react';

// Mock data for downline and history - in a real app, this would be fetched
const mockDownline = {
  'AF001': {
    levels: { 'Nível 1': 5, 'Nível 2': 15, 'Nível 3': 30 },
    levelDetails: {
      'Nível 1': [
        { id: 'DL001', name: 'Sub Afiliado 1.1', commissionGenerated: 150.00 },
        { id: 'DL002', name: 'Sub Afiliado 1.2', commissionGenerated: 200.00 },
      ],
      'Nível 2': [
        { id: 'DL003', name: 'Sub Afiliado 2.1', commissionGenerated: 50.00 },
      ]
    }
  },
  'AF002': {
    levels: { 'Nível 1': 2 },
    levelDetails: {
      'Nível 1': [
        { id: 'DL004', name: 'Sub Afiliado Outro 1.1', commissionGenerated: 75.00 },
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
  const [activeTab, setActiveTab] = useState<'details' | 'network' | 'commissions' | 'withdrawals' | 'activity'>('details');

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

  const affiliateDownline = (mockDownline as any)[affiliate.id] || { levels: {}, levelDetails: {} };

  return (
    <div className="bg-cinza-escuro p-1">
      <div className="flex items-center justify-between mb-6">
        <div>
            <Link to="/affiliates" className="flex items-center text-sm text-azul-ciano hover:text-opacity-80 mb-2">
                <ArrowLeft size={18} className="mr-1" />
                Voltar para Lista de Afiliados
            </Link>
            <h1 className="text-3xl font-bold text-branco font-sora">Detalhes do Afiliado</h1>
        </div>
        <div className="flex gap-2">
          <Link 
            to={`/affiliates/edit/${affiliate.id}`}
            className="px-4 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80 flex items-center"
          >
            <Edit2 size={16} className="mr-2" /> Editar Afiliado
          </Link>
          {/* TODO: Implement Change Status Modal/Functionality here if needed directly */}
        </div>
      </div>

      {/* Affiliate Quick Info Bar */}
      <div className="bg-cinza-claro p-6 rounded-lg shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div>
                <p className="text-sm text-gray-400">Nome</p>
                <p className="text-xl font-semibold text-branco">{affiliate.name}</p>
            </div>
            <div>
                <p className="text-sm text-gray-400">ID do Afiliado</p>
                <p className="text-lg font-mono text-gray-300">{affiliate.id}</p>
            </div>
            <div>
                <p className="text-sm text-gray-400">Status</p>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(affiliate.status)}`}>
                    {affiliate.status}
                </span>
            </div>
            <div>
                <p className="text-sm text-gray-400">Categoria/Level</p>
                <p className="text-lg text-branco">{affiliate.category}</p>
            </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-700">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
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
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center 
                ${activeTab === tab.key 
                  ? 'border-azul-ciano text-azul-ciano'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
            >
              <tab.icon size={16} className="mr-2"/> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-cinza-claro p-6 rounded-lg shadow-lg min-h-[300px]">
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
            <div className="mb-4">
                <p><strong className="text-gray-400">Upline Direto:</strong> {affiliate.upline || 'Nenhum'}</p>
            </div>
            <h3 className="text-lg font-semibold text-branco mb-2">Contagem de Indicados por Nível:</h3>
            <div className="flex flex-wrap gap-4 mb-6">
                {Object.entries(affiliateDownline.levels).map(([level, count]) => (
                    <div key={level} className="bg-cinza-escuro p-3 rounded-md text-center">
                        <p className="text-xs text-gray-400">{level}</p>
                        <p className="text-2xl font-bold text-azul-ciano">{count as number}</p>
                    </div>
                ))}
                {Object.keys(affiliateDownline.levels).length === 0 && <p className="text-gray-400">Nenhum indicado na rede.</p>}
            </div>
            <h3 className="text-lg font-semibold text-branco mb-2">Detalhes da Downline (por Nível):</h3>
            {/* TODO: Add dropdown to filter by level and paginate results */}
            {Object.entries(affiliateDownline.levelDetails).map(([level, details]) => (
                <div key={level} className="mb-4">
                    <h4 className="font-medium text-azul-ciano mb-1">{level}</h4>
                    {(details as any[]).length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                            {(details as any[]).map(item => (
                                <li key={item.id}>{item.name} (ID: {item.id}) - Comissões Geradas: R$ {item.commissionGenerated.toFixed(2)}</li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-gray-400">Nenhum indicado neste nível.</p>}
                </div>
            ))}
             {Object.keys(affiliateDownline.levelDetails).length === 0 && <p className="text-gray-400">Nenhum detalhe de downline disponível.</p>}
          </div>
        )}

        {activeTab === 'commissions' && (
          <div>
            <h2 className="text-xl font-semibold text-branco font-sora mb-4">Histórico de Comissões</h2>
            {/* TODO: Add filters for period and type */}
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
            {/* TODO: Add filters for period and status */}
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

