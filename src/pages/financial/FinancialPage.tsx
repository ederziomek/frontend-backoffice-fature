import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { ListChecks, History, CreditCard, Receipt, BarChart3, Calculator } from 'lucide-react';

// Importar os componentes reais das páginas financeiras
import WithdrawalRequestsPage from './WithdrawalRequestsPage';
import CommissionHistoryPage from './CommissionHistoryPage';
import PaymentMethodsPage from './PaymentMethodsPage';
import TransactionLogPage from './TransactionLogPage';
import FinancialReportsPage from './FinancialReportsPage';
import CommissionSimulationPage from './CommissionSimulationPage';

const financialSections = [
  { path: 'withdrawal-requests', label: 'Solicitações de Saque', icon: ListChecks, component: WithdrawalRequestsPage },
  { path: 'commission-history', label: 'Histórico de Comissões', icon: History, component: CommissionHistoryPage },
  { path: 'commission-simulation', label: 'Simulação de Comissões', icon: Calculator, component: CommissionSimulationPage },
  { path: 'payment-methods', label: 'Métodos de Pagamento', icon: CreditCard, component: PaymentMethodsPage },
  { path: 'transaction-log', label: 'Log de Transações', icon: Receipt, component: TransactionLogPage },
  { path: 'financial-reports', label: 'Relatórios Financeiros', icon: BarChart3, component: FinancialReportsPage },
];

const FinancialPage: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      <h1 className="text-2xl font-bold text-branco mb-6 font-sora">Gerenciamento Financeiro</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <nav className="md:w-1/4 lg:w-1/5 space-y-1 bg-cinza-escuro p-4 rounded-lg shadow-md self-start">
          {financialSections.map(section => (
            <Link
              key={section.path}
              to={`/financial/${section.path}`} // Alterado para rota absoluta
              className={`flex items-center px-3 py-2.5 text-sm rounded-md w-full text-left 
                ${location.pathname === `/financial/${section.path}` // Comparação com rota absoluta
                  ? 'bg-azul-ciano text-branco font-semibold shadow-lg'
                  : 'text-gray-300 hover:bg-cinza-claro hover:text-branco'}`}
            >
              <section.icon size={18} className="mr-3 flex-shrink-0" />
              {section.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1">
          <Routes>
            {/* Rota padrão para redirecionar para a primeira seção financeira */}
            <Route path="/" element={<Navigate to={`/financial/${financialSections[0].path}`} replace />} />
            {financialSections.map(section => (
              <Route key={section.path} path={section.path} element={<section.component />} />
            ))}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default FinancialPage;

