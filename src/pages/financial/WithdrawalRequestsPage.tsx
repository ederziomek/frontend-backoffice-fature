import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, CheckCircle, XCircle, Send, Download, Filter, Search, DollarSign } from 'lucide-react'; // Added DollarSign
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

type WithdrawalStatus = 'Pendente' | 'Aprovado' | 'Rejeitado' | 'Pago' | 'Em Processamento';

interface WithdrawalRequest {
  id: string;
  requestDate: string;
  affiliateName: string;
  affiliateId: string;
  amount: number;
  paymentMethod: string;
  paymentDetails: string; // Masked for security
  status: WithdrawalStatus;
}

const mockWithdrawals: WithdrawalRequest[] = [
  {
    id: 'SAQ001',
    requestDate: '2024-05-09 10:30',
    affiliateName: 'João Silva',
    affiliateId: 'AF001',
    amount: 150.00,
    paymentMethod: 'PIX',
    paymentDetails: 'Chave PIX: ***.***.123-**',
    status: 'Pendente',
  },
  {
    id: 'SAQ002',
    requestDate: '2024-05-09 14:00',
    affiliateName: 'Maria Oliveira',
    affiliateId: 'AF002',
    amount: 320.50,
    paymentMethod: 'Transferência Bancária',
    paymentDetails: 'Banco: XXX, Ag: 1234, CC: 56***-8',
    status: 'Aprovado',
  },
  {
    id: 'SAQ003',
    requestDate: '2024-05-10 09:15',
    affiliateName: 'Carlos Pereira',
    affiliateId: 'AF003',
    amount: 80.00,
    paymentMethod: 'PIX',
    paymentDetails: 'Chave PIX: (11) 9****-**34',
    status: 'Pago',
  },
  {
    id: 'SAQ004',
    requestDate: '2024-05-10 11:00',
    affiliateName: 'Ana Costa',
    affiliateId: 'AF004',
    amount: 500.00,
    paymentMethod: 'PIX',
    paymentDetails: 'Chave PIX: ana.costa@***.com',
    status: 'Rejeitado',
  },
];

const WithdrawalRequestsPage: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(mockWithdrawals);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WithdrawalStatus | 'Todos'>('Todos');
  const [methodFilter, setMethodFilter] = useState<string>('Todos');
  const [dateFilter, setDateFilter] = useState(''); // Simple date string for mock

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isMarkAsPaidModalOpen, setIsMarkAsPaidModalOpen] = useState(false);
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [internalNote, setInternalNote] = useState('');

  const filteredWithdrawals = withdrawals.filter(w => {
    return (
      (w.affiliateName.toLowerCase().includes(searchTerm.toLowerCase()) || w.affiliateId.toLowerCase().includes(searchTerm.toLowerCase()) || w.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'Todos' || w.status === statusFilter) &&
      (methodFilter === 'Todos' || w.paymentMethod === methodFilter) &&
      (dateFilter === '' || w.requestDate.startsWith(dateFilter)) // Basic date filter for mock
    );
  });

  const handleAction = (id: string, action: 'approve' | 'reject' | 'markAsPaid') => {
    setSelectedWithdrawalId(id);
    if (action === 'reject') setIsRejectModalOpen(true);
    if (action === 'approve') setIsApproveModalOpen(true);
    if (action === 'markAsPaid') setIsMarkAsPaidModalOpen(true);
  };

  const confirmReject = () => {
    console.log(`Rejeitando saque ${selectedWithdrawalId} com motivo: ${rejectionReason}`);
    // Mock update status
    setWithdrawals(prev => prev.map(w => w.id === selectedWithdrawalId ? { ...w, status: 'Rejeitado' } : w));
    setIsRejectModalOpen(false);
    setRejectionReason('');
    setSelectedWithdrawalId(null);
    alert('Solicitação de saque rejeitada (mock).');
  };

  const confirmApprove = () => {
    console.log(`Aprovando saque ${selectedWithdrawalId} com nota: ${internalNote}`);
    setWithdrawals(prev => prev.map(w => w.id === selectedWithdrawalId ? { ...w, status: 'Aprovado' } : w));
    setIsApproveModalOpen(false);
    setInternalNote('');
    setSelectedWithdrawalId(null);
    alert('Solicitação de saque aprovada (mock).');
  };

 const confirmMarkAsPaid = () => {
    console.log(`Marcando saque ${selectedWithdrawalId} como pago com nota: ${internalNote}`);
    setWithdrawals(prev => prev.map(w => w.id === selectedWithdrawalId ? { ...w, status: 'Pago' } : w));
    setIsMarkAsPaidModalOpen(false);
    setInternalNote('');
    setSelectedWithdrawalId(null);
    alert('Solicitação de saque marcada como paga (mock).');
  };

  // Mock data for KPI cards
  const totalPendente = withdrawals.filter(w => w.status === 'Pendente').reduce((sum, w) => sum + w.amount, 0);
  const totalAprovadoHoje = withdrawals.filter(w => w.status === 'Aprovado' && w.requestDate.startsWith('2024-05-10')).reduce((sum, w) => sum + w.amount, 0); // Assuming today is 2024-05-10 for mock
  const totalPagoHoje = withdrawals.filter(w => w.status === 'Pago' && w.requestDate.startsWith('2024-05-10')).reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="p-1 md:p-2">
      <h1 className="text-2xl font-bold text-branco mb-6 font-sora">Gerenciar Solicitações de Saque</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-cinza-escuro border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-azul-ciano">Total Pendente</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-branco">R$ {totalPendente.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="bg-cinza-escuro border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-azul-ciano">Total Aprovado Hoje</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-branco">R$ {totalAprovadoHoje.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="bg-cinza-escuro border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-azul-ciano">Total Pago Hoje</CardTitle>
            <Send className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-branco">R$ {totalPagoHoje.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <div className="mb-4 p-4 bg-cinza-escuro rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">Buscar (ID Saque, Nome/ID Afiliado)</label>
            <div className="relative">
                <Input 
                    id="search" 
                    placeholder="Buscar..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="bg-gray-700 border-gray-600 text-branco pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <Select value={statusFilter} onValueChange={(value: WithdrawalStatus | 'Todos') => setStatusFilter(value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-branco">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-cinza-escuro text-branco border-gray-600">
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                <SelectItem value="Pago">Pago</SelectItem>
                <SelectItem value="Em Processamento">Em Processamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="methodFilter" className="block text-sm font-medium text-gray-300 mb-1">Método</label>
            <Select value={methodFilter} onValueChange={(value) => setMethodFilter(value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-branco">
                <SelectValue placeholder="Método" />
              </SelectTrigger>
              <SelectContent className="bg-cinza-escuro text-branco border-gray-600">
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="Transferência Bancária">Transferência Bancária</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-300 mb-1">Data Solicitação (AAAA-MM-DD)</label>
            <Input 
              id="dateFilter" 
              type="text" // Using text for simple mock, ideally a date picker
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
            <Button variant="outline" className="bg-cinza-claro hover:bg-gray-700 text-branco border-gray-500" onClick={() => alert('Exportando dados (mock)...')}>
                <Download size={16} className="mr-2" /> Exportar CSV (mock)
            </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-cinza-escuro rounded-lg shadow-md overflow-x-auto">
        <Table className="text-branco">
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-700/20">
              <TableHead className="text-azul-ciano">ID Saque</TableHead>
              <TableHead className="text-azul-ciano">Data Solicitação</TableHead>
              <TableHead className="text-azul-ciano">Afiliado</TableHead>
              <TableHead className="text-azul-ciano">Valor (R$)</TableHead>
              <TableHead className="text-azul-ciano">Método</TableHead>
              <TableHead className="text-azul-ciano">Dados Pagamento</TableHead>
              <TableHead className="text-azul-ciano">Status</TableHead>
              <TableHead className="text-azul-ciano text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWithdrawals.map((w) => (
              <TableRow key={w.id} className="border-gray-700 hover:bg-gray-700/30">
                <TableCell>{w.id}</TableCell>
                <TableCell>{w.requestDate}</TableCell>
                <TableCell>{w.affiliateName} ({w.affiliateId})</TableCell>
                <TableCell>{w.amount.toFixed(2)}</TableCell>
                <TableCell>{w.paymentMethod}</TableCell>
                <TableCell className="text-xs">{w.paymentDetails}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${w.status === 'Pendente' ? 'bg-yellow-500/20 text-yellow-400' : 
                      w.status === 'Aprovado' ? 'bg-blue-500/20 text-blue-400' : 
                      w.status === 'Pago' ? 'bg-green-500/20 text-green-400' : 
                      w.status === 'Rejeitado' ? 'bg-red-500/20 text-red-400' : 
                      'bg-gray-500/20 text-gray-400'}`}>
                    {w.status}
                  </span>
                </TableCell>
                <TableCell className="text-center space-x-1">
                  {w.status === 'Pendente' && (
                    <>
                      <Button variant="ghost" size="icon" className="text-green-400 hover:text-green-300" onClick={() => handleAction(w.id, 'approve')}>
                        <CheckCircle size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => handleAction(w.id, 'reject')}>
                        <XCircle size={18} />
                      </Button>
                    </>
                  )}
                  {w.status === 'Aprovado' && (
                     <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300" onClick={() => handleAction(w.id, 'markAsPaid')}>
                        <Send size={18} />
                      </Button>
                  )}
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300" onClick={() => alert(`Ver detalhes do afiliado ${w.affiliateId} (mock)`)}>
                    <Eye size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredWithdrawals.length === 0 && (
                <TableRow className="border-gray-700">
                    <TableCell colSpan={8} className="text-center text-gray-400 py-4">
                        Nenhuma solicitação de saque encontrada com os filtros atuais.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* TODO: Add mock pagination controls */}

      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="bg-cinza-escuro text-branco border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-azul-ciano">Rejeitar Solicitação de Saque ({selectedWithdrawalId})</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-300 mb-1">Motivo da Rejeição (visível para o afiliado):</label>
            <Textarea id="rejectionReason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="bg-gray-700 border-gray-600" placeholder="Descreva o motivo..." />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-gray-500 hover:bg-gray-700">Cancelar</Button>
            </DialogClose>
            <Button onClick={confirmReject} className="bg-red-600 hover:bg-red-700">Confirmar Rejeição</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Modal */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="bg-cinza-escuro text-branco border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-azul-ciano">Aprovar Solicitação de Saque ({selectedWithdrawalId})</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="internalNoteApprove" className="block text-sm font-medium text-gray-300 mb-1">Nota Interna (opcional):</label>
            <Textarea id="internalNoteApprove" value={internalNote} onChange={(e) => setInternalNote(e.target.value)} className="bg-gray-700 border-gray-600" placeholder="Adicione uma nota interna..." />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-gray-500 hover:bg-gray-700">Cancelar</Button>
            </DialogClose>
            <Button onClick={confirmApprove} className="bg-green-600 hover:bg-green-700">Confirmar Aprovação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Paid Modal */}
      <Dialog open={isMarkAsPaidModalOpen} onOpenChange={setIsMarkAsPaidModalOpen}>
        <DialogContent className="bg-cinza-escuro text-branco border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-azul-ciano">Marcar Saque Como Pago ({selectedWithdrawalId})</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="internalNotePaid" className="block text-sm font-medium text-gray-300 mb-1">Nota Interna (opcional):</label>
            <Textarea id="internalNotePaid" value={internalNote} onChange={(e) => setInternalNote(e.target.value)} className="bg-gray-700 border-gray-600" placeholder="Adicione uma nota interna..." />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-gray-500 hover:bg-gray-700">Cancelar</Button>
            </DialogClose>
            <Button onClick={confirmMarkAsPaid} className="bg-blue-600 hover:bg-blue-700">Confirmar Pagamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default WithdrawalRequestsPage;

