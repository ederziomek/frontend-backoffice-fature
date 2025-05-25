import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Filter } from 'lucide-react'; // Removed BarChart as it was unused
import { ResponsiveContainer, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

// Mock data for reports
const mockCommissionReportData = [
  { type: 'RevShare', totalPaid: 1500.75, totalPending: 300.50 },
  { type: 'CPA', totalPaid: 2500.00, totalPending: 500.00 },
  { type: 'Bônus Ranking', totalPaid: 800.00, totalPending: 0 },
  { type: 'Bônus Sequência', totalPaid: 450.25, totalPending: 50.00 },
  { type: 'Bônus Baú', totalPaid: 200.00, totalPending: 10.00 },
];

const mockWithdrawalReportData = [
  { method: 'PIX', totalProcessed: 5, totalAmount: 1250.50, averageAmount: 250.10 },
  { method: 'Transferência Bancária', totalProcessed: 2, totalAmount: 850.00, averageAmount: 425.00 },
];

const FinancialReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<'commissions' | 'withdrawals'>('commissions');
  const [periodFilter, setPeriodFilter] = useState<string>('current_month'); // Example filter

  const handleExport = (reportName: string) => {
    alert(`Exportando relatório "${reportName}" (mock)...`);
  };

  const renderCommissionReport = () => (
    <Card className="bg-cinza-escuro border-gray-700 mt-4">
      <CardHeader>
        <CardTitle className="text-azul-ciano">Relatório de Comissões por Tipo (Período: {periodFilter})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={mockCommissionReportData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="type" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `R$${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#212a31', border: '1px solid #008181', borderRadius: '0.375rem' }} 
                labelStyle={{ color: '#008181', fontWeight: 'bold'}}
                itemStyle={{ color: '#e5e7eb' }}
              />
              <Legend wrapperStyle={{fontSize: "12px"}} />
              <Bar dataKey="totalPaid" name="Total Pago" fill="#008181" radius={[4, 4, 0, 0]} />
              <Bar dataKey="totalPending" name="Total Pendente" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
        <Table className="text-branco">
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-azul-ciano">Tipo de Comissão</TableHead>
              <TableHead className="text-azul-ciano text-right">Total Pago (R$)</TableHead>
              <TableHead className="text-azul-ciano text-right">Total Pendente (R$)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCommissionReportData.map((row) => (
              <TableRow key={row.type} className="border-gray-700 hover:bg-gray-700/30">
                <TableCell>{row.type}</TableCell>
                <TableCell className="text-right">{row.totalPaid.toFixed(2)}</TableCell>
                <TableCell className="text-right">{row.totalPending.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" className="bg-cinza-claro hover:bg-gray-700 text-branco border-gray-500" onClick={() => handleExport('Comissões por Tipo')}>
            <Download size={16} className="mr-2" /> Exportar (mock)
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderWithdrawalReport = () => (
    <Card className="bg-cinza-escuro border-gray-700 mt-4">
      <CardHeader>
        <CardTitle className="text-azul-ciano">Relatório de Saques Processados por Método (Período: {periodFilter})</CardTitle>
      </CardHeader>
      <CardContent>
         <div className="h-[300px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={mockWithdrawalReportData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="method" stroke="#9ca3af" fontSize={12} />
              <YAxis yAxisId="left" orientation="left" stroke="#008181" fontSize={12} tickFormatter={(value) => `R$${value}`} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#212a31', border: '1px solid #008181', borderRadius: '0.375rem' }} 
                labelStyle={{ color: '#008181', fontWeight: 'bold'}}
                itemStyle={{ color: '#e5e7eb' }}
              />
              <Legend wrapperStyle={{fontSize: "12px"}}/>
              <Bar yAxisId="left" dataKey="totalAmount" name="Valor Total (R$)" fill="#008181" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="totalProcessed" name="Qtd. Processados" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
        <Table className="text-branco">
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-azul-ciano">Método de Pagamento</TableHead>
              <TableHead className="text-azul-ciano text-right">Qtd. Processados</TableHead>
              <TableHead className="text-azul-ciano text-right">Valor Total (R$)</TableHead>
              <TableHead className="text-azul-ciano text-right">Valor Médio (R$)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockWithdrawalReportData.map((row) => (
              <TableRow key={row.method} className="border-gray-700 hover:bg-gray-700/30">
                <TableCell>{row.method}</TableCell>
                <TableCell className="text-right">{row.totalProcessed}</TableCell>
                <TableCell className="text-right">{row.totalAmount.toFixed(2)}</TableCell>
                <TableCell className="text-right">{row.averageAmount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" className="bg-cinza-claro hover:bg-gray-700 text-branco border-gray-500" onClick={() => handleExport('Saques Processados por Método')}>
            <Download size={16} className="mr-2" /> Exportar (mock)
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-1 md:p-2">
      <h1 className="text-2xl font-bold text-branco mb-6 font-sora">Relatórios Financeiros</h1>

      <div className="mb-4 p-4 bg-cinza-escuro rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
            <div className="w-full sm:w-auto">
                <label htmlFor="reportType" className="block text-sm font-medium text-gray-300 mb-1">Selecionar Relatório</label>
                <Select value={selectedReport} onValueChange={(value: 'commissions' | 'withdrawals') => setSelectedReport(value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-branco w-full sm:w-[250px]">
                        <SelectValue placeholder="Tipo de Relatório" />
                    </SelectTrigger>
                    <SelectContent className="bg-cinza-escuro text-branco border-gray-600">
                        <SelectItem value="commissions">Comissões por Tipo</SelectItem>
                        <SelectItem value="withdrawals">Saques Processados por Método</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="w-full sm:w-auto">
                <label htmlFor="periodFilter" className="block text-sm font-medium text-gray-300 mb-1">Período</label>
                <Select value={periodFilter} onValueChange={(value) => setPeriodFilter(value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-branco w-full sm:w-[180px]">
                        <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent className="bg-cinza-escuro text-branco border-gray-600">
                        <SelectItem value="today">Hoje</SelectItem>
                        <SelectItem value="yesterday">Ontem</SelectItem>
                        <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                        <SelectItem value="current_month">Mês Atual</SelectItem>
                        <SelectItem value="last_month">Mês Anterior</SelectItem>
                        <SelectItem value="all_time">Todo o Período</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <Button variant="outline" className="bg-azul-ciano hover:bg-azul-ciano/80 text-branco border-azul-ciano mt-4 md:mt-0 self-start md:self-center">
            <Filter size={16} className="mr-2" /> Aplicar Filtros (mock)
        </Button>
      </div>

      {selectedReport === 'commissions' && renderCommissionReport()}
      {selectedReport === 'withdrawals' && renderWithdrawalReport()}

    </div>
  );
};

export default FinancialReportsPage;

