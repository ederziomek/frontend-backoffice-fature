import React, { useState } from 'react';
// import { Button } from '@/components/ui/button'; // Unused import
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Filter, Search } from 'lucide-react';
import { Button } from "@/components/ui/button"; // Added this line to fix the build error, as Button is used.

interface TransactionLogEntry {
  id: string;
  dateTime: string;
  transactionType: 'Saque' | 'Pagamento de Comissão' | 'Bônus' | 'Ajuste Manual';
  description: string;
  amount: number;
  affiliateInvolved?: string; // Name/ID
  adminUser?: string; // If manual action
}

const mockTransactions: TransactionLogEntry[] = [
  {
    id: 'TRN001',
    dateTime: '2024-05-10 09:15:30',
    transactionType: 'Pagamento de Comissão',
    description: 'Pagamento de comissão RevShare para Afiliado Carlos Pereira (AF003)',
    amount: 45.00,
    affiliateInvolved: 'Carlos Pereira (AF003)',
  },
  {
    id: 'TRN002',
    dateTime: '2024-05-10 09:16:00',
    transactionType: 'Saque',
    description: 'Saque de R$80.00 aprovado e pago para Afiliado Carlos Pereira (AF003)',
    amount: -80.00,
    affiliateInvolved: 'Carlos Pereira (AF003)',
    adminUser: 'AdminMaster'
  },
  {
    id: 'TRN003',
    dateTime: '2024-05-09 14:05:00',
    transactionType: 'Saque',
    description: 'Saque de R$320.50 aprovado para Afiliado Maria Oliveira (AF002)',
    amount: -320.50,
    affiliateInvolved: 'Maria Oliveira (AF002)',
    adminUser: 'AdminMaster'
  },
  {
    id: 'TRN004',
    dateTime: '2024-05-09 10:30:00',
    transactionType: 'Bônus',
    description: 'Bônus de Ranking #1 aplicado para Afiliado João Silva (AF001)',
    amount: 50.00,
    affiliateInvolved: 'João Silva (AF001)',
    adminUser: 'Sistema'
  },
   {
    id: 'TRN005',
    dateTime: '2024-05-08 17:00:00',
    transactionType: 'Ajuste Manual',
    description: 'Correção de comissão CPA para Afiliado Ana Costa (AF004)',
    amount: 15.00,
    affiliateInvolved: 'Ana Costa (AF004)',
    adminUser: 'GerenteFinanceiro'
  },
];

const TransactionLogPage: React.FC = () => {
  const [transactions] = useState<TransactionLogEntry[]>(mockTransactions); // Removed setTransactions
  const [searchTerm, setSearchTerm] = useState(''); // For Affiliate or Admin User
  const [typeFilter, setTypeFilter] = useState<TransactionLogEntry['transactionType'] | 'Todos'>('Todos');
  const [dateFilter, setDateFilter] = useState(''); // Simple date string for mock

  const filteredTransactions = transactions.filter(t => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (t.description.toLowerCase().includes(searchTermLower) || 
       (t.affiliateInvolved && t.affiliateInvolved.toLowerCase().includes(searchTermLower)) || 
       (t.adminUser && t.adminUser.toLowerCase().includes(searchTermLower)) ||
       t.id.toLowerCase().includes(searchTermLower)
      ) &&
      (typeFilter === 'Todos' || t.transactionType === typeFilter) &&
      (dateFilter === '' || t.dateTime.startsWith(dateFilter))
    );
  });

  return (
    <div className="p-1 md:p-2">
      <h1 className="text-2xl font-bold text-branco mb-6 font-sora">Log de Transações Financeiras</h1>

      {/* Filters */}
      <div className="mb-4 p-4 bg-cinza-escuro rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-1">
            <label htmlFor="searchLog" className="block text-sm font-medium text-gray-300 mb-1">Buscar (ID, Descrição, Afiliado, Admin)</label>
            <div className="relative">
                <Input 
                    id="searchLog" 
                    placeholder="Buscar no log..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="bg-gray-700 border-gray-600 text-branco pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="typeLogFilter" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Transação</label>
            <Select value={typeFilter} onValueChange={(value: TransactionLogEntry['transactionType'] | 'Todos') => setTypeFilter(value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-branco">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-cinza-escuro text-branco border-gray-600">
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Saque">Saque</SelectItem>
                <SelectItem value="Pagamento de Comissão">Pagamento de Comissão</SelectItem>
                <SelectItem value="Bônus">Bônus</SelectItem>
                <SelectItem value="Ajuste Manual">Ajuste Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="dateLogFilter" className="block text-sm font-medium text-gray-300 mb-1">Data Transação (AAAA-MM-DD)</label>
            <Input 
              id="dateLogFilter" 
              type="text" 
              placeholder="AAAA-MM-DD" 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)} 
              className="bg-gray-700 border-gray-600 text-branco"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
            <Button variant="outline" className="bg-azul-ciano hover:bg-azul-ciano/80 text-branco border-azul-ciano">
                <Filter size={16} className="mr-2" /> Aplicar Filtros (mock)
            </Button>
            <Button variant="outline" className="bg-cinza-claro hover:bg-gray-700 text-branco border-gray-500" onClick={() => alert('Exportando log de transações (mock)...')}>
                <Download size={16} className="mr-2" /> Exportar CSV (mock)
            </Button>
        </div>
      </div>

      {/* Table - Simplified columns as per user request */}
      <div className="bg-cinza-escuro rounded-lg shadow-md overflow-x-auto">
        <Table className="text-branco">
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-700/20">
              <TableHead className="text-azul-ciano">ID Transação</TableHead>
              <TableHead className="text-azul-ciano">Data/Hora</TableHead>
              <TableHead className="text-azul-ciano">Tipo</TableHead>
              <TableHead className="text-azul-ciano">Descrição</TableHead>
              <TableHead className="text-azul-ciano">Valor (R$)</TableHead>
              <TableHead className="text-azul-ciano">Afiliado Envolvido</TableHead>
              <TableHead className="text-azul-ciano">Usuário Backoffice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((t) => (
              <TableRow key={t.id} className="border-gray-700 hover:bg-gray-700/30">
                <TableCell>{t.id}</TableCell>
                <TableCell>{t.dateTime}</TableCell>
                <TableCell>{t.transactionType}</TableCell>
                <TableCell className="text-xs max-w-xs truncate">{t.description}</TableCell>
                <TableCell className={t.amount < 0 ? 'text-red-400' : 'text-green-400'}>{t.amount.toFixed(2)}</TableCell>
                <TableCell>{t.affiliateInvolved || 'N/A'}</TableCell>
                <TableCell>{t.adminUser || 'N/A'}</TableCell>
              </TableRow>
            ))}
            {filteredTransactions.length === 0 && (
                <TableRow className="border-gray-700">
                    <TableCell colSpan={7} className="text-center text-gray-400 py-4">
                        Nenhuma transação encontrada com os filtros atuais.
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

export default TransactionLogPage;

