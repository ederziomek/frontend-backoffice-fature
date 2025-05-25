import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker"; // Import DateRange

// Extended mock data for 15 days and more fields
const generateMockData = () => {
  const data = [];
  const baseDate = new Date();
  for (let i = 14; i >= 0; i--) {
    const date = subDays(baseDate, i);
    data.push({
      date: format(date, "dd/MM/yyyy"), // Store full date for easier filtering
      displayDate: format(date, "dd/MM"),
      qtdAfiliados: Math.floor(Math.random() * 50) + 10,
      qtdClientes: Math.floor(Math.random() * 200) + 50,
      valorDepositado: Math.floor(Math.random() * 10000) + 5000,
      ngrGerado: Math.floor(Math.random() * 5000) + 1000,
      comissoesPagas: Math.floor(Math.random() * 2000) + 500,
      get resultado() { return this.ngrGerado - this.comissoesPagas; }
    });
  }
  return data;
};

const initialMockData = generateMockData();

const lineOptions = [
  { id: "qtdAfiliados", name: "Qtd afiliados", color: "#8884d8" },
  { id: "qtdClientes", name: "Qtd Clientes", color: "#82ca9d" },
  { id: "valorDepositado", name: "Valor Depositado", color: "#ffc658" },
  { id: "ngrGerado", name: "NGR Gerado", color: "#13c9b8" },
  { id: "comissoesPagas", name: "Comissões Pagas", color: "#FF8042" },
  { id: "resultado", name: "Resultado", color: "#FF0000" },
];

const dateFilterOptions = [
  { id: "total", name: "Total (Últimos 15 dias)" },
  { id: "hoje", name: "Hoje" },
  { id: "ontem", name: "Ontem" },
  { id: "estaSemana", name: "Essa Semana (Seg-Dom)" },
  { id: "semanaPassada", name: "Semana passada (Seg-Dom)" },
  { id: "esteMes", name: "Esse Mês" },
  { id: "personalizado", name: "Personalizado" },
];

const categoryFilterOptions = [
  "Total", "Jogador", "Iniciante", "Afiliado", "Profissional", "Expert", "Mestre", "Lenda"
];

const DailyPerformanceChart: React.FC = () => {
  const [selectedLines, setSelectedLines] = useState<string[]>(["ngrGerado", "comissoesPagas"]);
  const [dateFilter, setDateFilter] = useState<string>("total");
  const [categoryFilter, setCategoryFilter] = useState<string>("Total");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined); // Use DateRange type

  const handleLineSelectionChange = (lineId: string) => {
    setSelectedLines(prev =>
      prev.includes(lineId) ? prev.filter(id => id !== lineId) : [...prev, lineId]
    );
  };

  const filteredData = useMemo(() => {
    let data = [...initialMockData];
    const today = new Date();
    today.setHours(0,0,0,0);

    switch (dateFilter) {
      case "hoje":
        data = initialMockData.filter(d => parse(d.date, "dd/MM/yyyy", new Date()).getTime() === today.getTime());
        break;
      case "ontem":
        const yesterday = subDays(today, 1);
        data = initialMockData.filter(d => parse(d.date, "dd/MM/yyyy", new Date()).getTime() === yesterday.getTime());
        break;
      case "estaSemana":
        const currentWeekStart = startOfWeek(today, { weekStartsOn: 1, locale: ptBR });
        const currentWeekEnd = endOfWeek(today, { weekStartsOn: 1, locale: ptBR });
        data = initialMockData.filter(d => {
            const itemDate = parse(d.date, "dd/MM/yyyy", new Date());
            return itemDate >= currentWeekStart && itemDate <= currentWeekEnd;
        });
        break;
      case "semanaPassada":
        const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1, locale: ptBR });
        const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 1, locale: ptBR });
        data = initialMockData.filter(d => {
            const itemDate = parse(d.date, "dd/MM/yyyy", new Date());
            return itemDate >= lastWeekStart && itemDate <= lastWeekEnd;
        });
        break;
      case "esteMes":
        const currentMonthStart = startOfMonth(today);
        const currentMonthEnd = endOfMonth(today);
        data = initialMockData.filter(d => {
            const itemDate = parse(d.date, "dd/MM/yyyy", new Date());
            return itemDate >= currentMonthStart && itemDate <= currentMonthEnd;
        });
        break;
      case "personalizado":
        if (customDateRange?.from && customDateRange?.to) {
          const from = new Date(customDateRange.from);
          from.setHours(0,0,0,0);
          const to = new Date(customDateRange.to);
          to.setHours(23,59,59,999);
          data = initialMockData.filter(d => {
            const itemDate = parse(d.date, "dd/MM/yyyy", new Date());
            return itemDate >= from && itemDate <= to;
          });
        } else if (customDateRange?.from) {
            const from = new Date(customDateRange.from);
            from.setHours(0,0,0,0);
            data = initialMockData.filter(d => {
                const itemDate = parse(d.date, "dd/MM/yyyy", new Date());
                return itemDate >= from;
            });
        }
        break;
      case "total":
      default:
        // Use all 15 days from initialMockData
        data = initialMockData.slice(); 
        break;
    }
    // console.log("Category filter (not implemented for data filtering yet):", categoryFilter);
    return data.map(item => ({...item, date: item.displayDate })); // Use displayDate for XAxis
  }, [dateFilter, customDateRange, categoryFilter]);

  return (
    <div className="p-4 rounded-lg shadow-md bg-cinza-claro">
      <h2 className="text-xl font-semibold mb-4 text-white">Gráfico de Desempenho Diário</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Campos de Seleção:</label>
          <div className="space-y-2">
            {lineOptions.map(option => (
              <div key={option.id} className="flex items-center">
                <Checkbox
                  id={`line-${option.id}`}
                  checked={selectedLines.includes(option.id)}
                  onCheckedChange={() => handleLineSelectionChange(option.id)}
                  className="border-gray-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                  style={{ accentColor: option.color }} 
                />
                <label htmlFor={`line-${option.id}`} className="ml-2 text-sm text-gray-200 cursor-pointer" style={{ color: option.color }}>
                  {option.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-300 mb-2">Filtro de Data:</label>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500">
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
          {dateFilter === "personalizado" && (
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
          <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-300 mb-2">Filtro de Categoria:</label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500">
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

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 20, // Increased bottom margin for XAxis labels
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="date" stroke="#A0AEC0" angle={-30} textAnchor="end" height={50} interval={filteredData.length > 10 ? "preserveStartEnd" : 0}/>
            <YAxis stroke="#A0AEC0" />
            <Tooltip
              contentStyle={{ backgroundColor: "#2D3748", border: "1px solid #4A5568", color: "#E2E8F0" }}
              itemStyle={{ color: "#E2E8F0" }}
              formatter={(value: number, name: string) => [value, name]}
              labelFormatter={(label: string) => `Data: ${label}`}
            />
            <Legend wrapperStyle={{ color: "#E2E8F0", paddingTop: "10px" }} />
            {lineOptions.map(line =>
              selectedLines.includes(line.id) ? (
                <Line
                  key={line.id}
                  type="monotone"
                  dataKey={line.id}
                  name={line.name}
                  stroke={line.color}
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 0, style: { fill: line.color } }}
                  dot={{ r: 3, strokeWidth: 0, style: { fill: line.color } }}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyPerformanceChart;

