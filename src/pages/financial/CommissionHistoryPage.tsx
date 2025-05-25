import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Filter, Search, Download } from 'lucide-react';

interface CommissionEntry {
  id: string;
  affiliateName: string;
  affiliateId: string;
  paymentDate: string; // Simplified to payment date as per user
  paidCommissions: number;
  commissionType: string; // For filtering, even if not displayed in main table
  status: 'Paga' | 'Pendente' | 'Cancelada'; // For filtering
  generatorId?: string; // For filtering
}

const mockCommissions: CommissionEntry[] = [
  {
    id: 'COM001',
    affiliateName: 'João Silva',
    affiliateId: 'AF001',
    paymentDate: '2024-05-01',
    paidCommissions: 75.50,
    commissionType: 'RevShare',
    status: 'Paga',
    generatorId: 'JOG012'
  },
  {
    id: 'COM002',
    affiliateName: 'Maria Oliveira',
    affiliateId: 'AF002',
    paymentDate: '2024-05-01',
    paidCommissions: 120.00,
    commissionType: 'CPA',
    status: 'Paga',
    generatorId: 'JOG015'
  },
  {
    id: 'COM003',
    affiliateName: 'Carlos Pereira',
    affiliateId: 'AF003',
    paymentDate: '2024-05-08',
    paidCommissions: 45.00,
    commissionType: 'Bônus de Ranking',
    status: 'Paga',
  },
  {
    id: 'COM004',
    affiliateName: 'João Silva',
    affiliateId: 'AF001',
    paymentDate: 'N/A (Pendente)', // Or handle differently if status is Pendente
    paidCommissions: 30.25,
    commissionType: 'RevShare',
    status: 'Pendente',
    generatorId: 'JOG022'
  },
  {
    id: 'COM005',
    affiliateName: 'Ana Costa',
    affiliateId: 'AF004',
    paymentDate: '2024-04-25',
    paidCommissions: 90.00,
    commissionType: 'CPA',
    status: 'Paga',
    generatorId: 'JOG030'
  },
];

const CommissionHistoryPage: React.FC = () => {
  const [commissions] = useState<CommissionEntry[]>(mockCommissions); // Removed setCommissions
  const [searchTerm, setSearchTerm] = useState(''); // For Affiliate Name/ID
  const [typeFilter, setTypeFilter] = useState<string>('Todos');
  const [statusFilter, setStatusFilter] = useState<'Paga' | 'Pendente' | 'Cancelada' | 'Todos'>('Todos');
  const [dateFilter, setDateFilter] = useState(''); // Simple date string for mock
  const [generatorFilter, setGeneratorFilter] = useState('');

  const filteredCommissions = commissions.filter(c => {
    return (
      (c.affiliateName.toLowerCase().includes(searchTerm.toLowerCase()) || c.affiliateId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (typeFilter === 'Todos' || c.commissionType === typeFilter) &&
      (statusFilter === 'Todos' || c.status === statusFilter) &&
      (dateFilter === '' || c.paymentDate.startsWith(dateFilter) || (c.status === 'Pendente' && dateFilter === '')) && // Adjust for pending items
      (generatorFilter === '' || (c.generatorId && c.generatorId.toLowerCase().includes(generatorFilter.toLowerCase())))
    );
  });

  const totalPagaPeriodo = filteredCommissions.filter(c => c.status === 'Paga').reduce((sum, c) => sum + c.paidCommissions, 0);
  const totalPendentePeriodo = filteredCommissions.filter(c => c.status === 'Pendente').reduce((sum, c) => sum + c.paidCommissions, 0);

  return (
    <div className="p-1 md:p-2">
      <h1 className="text-2xl font-bold text-branco mb-6 font-sora">Histórico de Comissões</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-cinza-escuro border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-azul-ciano">Total Pago (Período Filtrado)</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-branco">R$ {totalPagaPeriodo.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="bg-cinza-escuro border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-azul-ciano">Total Pendente (Período Filtrado)</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-branco">R$ {totalPendentePeriodo.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-4 p-4 bg-cinza-escuro rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-1">
            <label htmlFor="searchAffiliate" className="block text-sm font-medium text-gray-300 mb-1">Afiliado (Nome/ID)</label>
            <div className="relative">
                <Input 
                    id="searchAffiliate" 
                    placeholder="Buscar Afiliado..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="bg-gray-700 border-gray-600 text-branco pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-300 mb-1">Tipo Comissão</label>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-branco">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-cinza-escuro text-branco border-gray-600">
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="CPA">CPA</SelectItem>
                <SelectItem value="RevShare">RevShare</SelectItem>
                <SelectItem value="Bônus de Sequência">Bônus de Sequência</SelectItem>
                <SelectItem value="Bônus de Ranking">Bônus de Ranking</SelectItem>
                <SelectItem value="Bônus de Baú">Bônus de Baú</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="statusComFilter" className="block text-sm font-medium text-gray-300 mb-1">Status Comissão</label>
            <Select value={statusFilter} onValueChange={(value: 'Paga' | 'Pendente' | 'Cancelada' | 'Todos') => setStatusFilter(value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-branco">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-cinza-escuro text-branco border-gray-600">
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Paga">Paga</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="dateComFilter" className="block text-sm font-medium text-gray-300 mb-1">Data Pagamento (AAAA-MM-DD)</label>
            <Input 
              id="dateComFilter" 
              type="text" 
              placeholder="AAAA-MM-DD" 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)} 
              className="bg-gray-700 border-gray-600 text-branco"
            />
          </div>
           <div>
            <label htmlFor="generatorFilter" className="block text-sm font-medium text-gray-300 mb-1">ID Gerador (Jogador/Afiliado)</label>
            <Input 
              id="generatorFilter" 
              type="text" 
              placeholder="ID Gerador..." 
              value={generatorFilter} 
              onChange={(e) => setGeneratorFilter(e.target.value)} 
              className="bg-gray-700 border-gray-600 text-branco"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
            <Button variant="outline" className="bg-azul-ciano hover:bg-azul-ciano/80 text-branco border-azul-ciano">
                <Filter size={16} className="mr-2" /> Aplicar Filtros (mock)
            </Button>
            <Button variant="outline" className="bg-cinza-claro hover:bg-gray-700 text-branco border-gray-500" onClick={() => alert('Exportando histórico de comissões (mock)...')}>
                <Download size={16} className="mr-2" /> Exportar CSV (mock)
            </Button>
        </div>
      </div>

      {/* Table - Simplified as per user request */}
      <div className="bg-cinza-escuro rounded-lg shadow-md overflow-x-auto">
        <Table className="text-branco">
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-700/20">
              <TableHead className="text-azul-ciano">Nome do Afiliado</TableHead>
              <TableHead className="text-azul-ciano">Data do Pagamento</TableHead>
              <TableHead className="text-azul-ciano">Comissões Pagas (R$)</TableHead>
              <TableHead className="text-azul-ciano">Status</TableHead>
              {/* No actions column as per user feedback */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCommissions.map((c) => (
              <TableRow key={c.id} className="border-gray-700 hover:bg-gray-700/30">
                <TableCell>{c.affiliateName} ({c.affiliateId})</TableCell>
                <TableCell>{c.status === 'Pendente' ? 'Pendente' : c.paymentDate}</TableCell>
                <TableCell>{c.paidCommissions.toFixed(2)}</TableCell>
                <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${c.status === 'Pendente' ? 'bg-yellow-500/20 text-yellow-400' : 
                          c.status === 'Paga' ? 'bg-green-500/20 text-green-400' : 
                          c.status === 'Cancelada' ? 'bg-red-500/20 text-red-400' : 
                          'bg-gray-500/20 text-gray-400'}`}>
                        {c.status}
                    </span>
                </TableCell>
              </TableRow>
            ))}
            {filteredCommissions.length === 0 && (
                <TableRow className="border-gray-700">
                    <TableCell colSpan={4} className="text-center text-gray-400 py-4">
                        Nenhum histórico de comissão encontrado com os filtros atuais.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* TODO: Add mock pagination controls */}
    </div>
  );
};

export default CommissionHistoryPage;

