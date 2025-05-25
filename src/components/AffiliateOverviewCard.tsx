import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parse } from 'date-fns'; // Removed differenceInDays
import { ptBR } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker'; // Import DateRange

// Mock data - this should ideally come from a prop or context
const generateDetailedMockData = (days = 30) => {
  const data = [];
  const baseDate = new Date();
  const categories = ['Jogador', 'Iniciante', 'Afiliado', 'Profissional', 'Expert', 'Mestre', 'Lenda'];
  for (let i = days -1; i >= 0; i--) {
    const date = subDays(baseDate, i);
    for (let j = 0; j < (Math.random() * 5 + 2); j++) { // Simulate multiple entries per day for different affiliates
        data.push({
            date: format(date, 'dd/MM/yyyy'),
            category: categories[Math.floor(Math.random() * categories.length)],
            qtdAfiliados: 1, // Each entry is an 'event' or 'snapshot'
            qtdClientes: Math.floor(Math.random() * 5) + 1,
            valorDepositado: Math.floor(Math.random() * 1000) + 100,
            ngrGerado: Math.floor(Math.random() * 500) + 50,
            comissoesPagas: Math.floor(Math.random() * 100) + 10,
        });
    }
  }
  return data;
};

const allMockData = generateDetailedMockData(90); // Generate more data for wider filtering

const dateFilterOptions = [
  { id: 'total', name: 'Total' },
  { id: 'hoje', name: 'Hoje' },
  { id: 'ontem', name: 'Ontem' },
  { id: 'estaSemana', name: 'Essa Semana (Seg-Dom)' },
  { id: 'semanaPassada', name: 'Semana passada (Seg-Dom)' },
  { id: 'esteMes', name: 'Esse Mês' },
  { id: 'personalizado', name: 'Personalizado' },
];

const categoryFilterOptions = [
  'Total', 'Jogador', 'Iniciante', 'Afiliado', 'Profissional', 'Expert', 'Mestre', 'Lenda'
];

// Removed unused interface AffiliateDataPoint

const AffiliateOverviewCard: React.FC = () => {
  const [dateFilter, setDateFilter] = useState<string>('total');
  const [categoryFilter, setCategoryFilter] = useState<string>('Total');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined); // Use DateRange type

  const processedData = useMemo(() => {
    let filtered = [...allMockData];
    const today = new Date();
    today.setHours(0,0,0,0);

    // Date Filtering
    switch (dateFilter) {
      case 'hoje':
        filtered = filtered.filter(d => parse(d.date, 'dd/MM/yyyy', new Date()).getTime() === today.getTime());
        break;
      case 'ontem':
        const yesterday = subDays(today, 1);
        filtered = filtered.filter(d => parse(d.date, 'dd/MM/yyyy', new Date()).getTime() === yesterday.getTime());
        break;
      case 'estaSemana':
        const currentWeekStart = startOfWeek(today, { weekStartsOn: 1, locale: ptBR });
        const currentWeekEnd = endOfWeek(today, { weekStartsOn: 1, locale: ptBR });
        filtered = filtered.filter(d => {
            const itemDate = parse(d.date, 'dd/MM/yyyy', new Date());
            return itemDate >= currentWeekStart && itemDate <= currentWeekEnd;
        });
        break;
      case 'semanaPassada':
        const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1, locale: ptBR });
        const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 1, locale: ptBR });
        filtered = filtered.filter(d => {
            const itemDate = parse(d.date, 'dd/MM/yyyy', new Date());
            return itemDate >= lastWeekStart && itemDate <= lastWeekEnd;
        });
        break;
      case 'esteMes':
        const currentMonthStart = startOfMonth(today);
        const currentMonthEnd = endOfMonth(today);
        filtered = filtered.filter(d => {
            const itemDate = parse(d.date, 'dd/MM/yyyy', new Date());
            return itemDate >= currentMonthStart && itemDate <= currentMonthEnd;
        });
        break;
      case 'personalizado':
        if (customDateRange?.from && customDateRange?.to) {
          const from = new Date(customDateRange.from);
          from.setHours(0,0,0,0);
          const to = new Date(customDateRange.to);
          to.setHours(23,59,59,999);
          filtered = filtered.filter(d => {
            const itemDate = parse(d.date, 'dd/MM/yyyy', new Date());
            return itemDate >= from && itemDate <= to;
          });
        } else if (customDateRange?.from) {
            const from = new Date(customDateRange.from);
            from.setHours(0,0,0,0);
             filtered = filtered.filter(d => {
                const itemDate = parse(d.date, 'dd/MM/yyyy', new Date());
                return itemDate >= from;
            });
        }
        break;
      case 'total':
      default:
        // No date filtering, use all data for 'total'
        break;
    }

    // Category Filtering
    if (categoryFilter !== 'Total') {
      filtered = filtered.filter(d => d.category === categoryFilter);
    }

    // Aggregate data
    const aggregated = filtered.reduce((acc, curr) => {
      acc.qtdAfiliados += curr.qtdAfiliados; // Assuming each record is a unique affiliate for the period for simplicity
      acc.qtdClientes += curr.qtdClientes;
      acc.valorDepositado += curr.valorDepositado;
      acc.ngrGerado += curr.ngrGerado;
      acc.comissoesPagas += curr.comissoesPagas;
      return acc;
    }, { qtdAfiliados: 0, qtdClientes: 0, valorDepositado: 0, ngrGerado: 0, comissoesPagas: 0 });

    const resultado = aggregated.ngrGerado - aggregated.comissoesPagas;

    return {
      ...aggregated,
      resultado,
    };
  }, [dateFilter, categoryFilter, customDateRange]);

  return (
    <div className="p-6 rounded-lg shadow-xl bg-cinza-claro border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="dateFilterCard" className="block text-sm font-medium text-gray-300 mb-1">Período:</label>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger id="dateFilterCard" className="w-full bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              {dateFilterOptions.map(option => (
                <SelectItem key={option.id} value={option.id} className="hover:bg-gray-600 focus:bg-gray-600">
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {dateFilter === 'personalizado' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full mt-2 justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white focus:ring-blue-500 focus:border-blue-500">
                  {customDateRange?.from ? (
                    customDateRange.to ? (
                      <>
                        {format(customDateRange.from, "P", { locale: ptBR })} - {format(customDateRange.to, "P", { locale: ptBR })}
                      </>
                    ) : (
                      format(customDateRange.from, "P", { locale: ptBR })
                    )
                  ) : (
                    <span>Escolha o período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600" align="start">
                <Calendar
                  mode="range"
                  selected={customDateRange}
                  onSelect={setCustomDateRange}
                  initialFocus
                  locale={ptBR}
                  className="text-white [&_button]:text-white [&_th]:text-gray-400 [&_[aria-selected]]:bg-blue-500 [&_[aria-selected]]:text-white [&_button:hover]:bg-gray-700 [&_button:focus]:ring-1 [&_button:focus]:ring-blue-500"
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div>
          <label htmlFor="categoryFilterCard" className="block text-sm font-medium text-gray-300 mb-1">Categoria:</label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="categoryFilterCard" className="w-full bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              {categoryFilterOptions.map(option => (
                <SelectItem key={option} value={option} className="hover:bg-gray-600 focus:bg-gray-600">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-300">Quantidade de Afiliados:</span>
          <span className="font-semibold text-lg text-white">{processedData.qtdAfiliados}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-300">Quantidade de Clientes:</span>
          <span className="font-semibold text-lg text-white">{processedData.qtdClientes}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-300">Valor Depositado:</span>
          <span className="font-semibold text-lg text-white">R$ {processedData.valorDepositado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-300">NGR Gerado:</span>
          <span className="font-semibold text-lg text-white">R$ {processedData.ngrGerado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-300">Comissões Pagas:</span>
          <span className="font-semibold text-lg text-white">R$ {processedData.comissoesPagas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-300">Resultado (NGR - Comissões):</span>
          <span className={`font-semibold text-lg ${processedData.resultado >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            R$ {processedData.resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AffiliateOverviewCard;

