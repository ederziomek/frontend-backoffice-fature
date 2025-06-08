import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { SlidersHorizontal, Users, TrendingUp, Award, ShieldCheck, Box, Banknote, UserCog, DollarSign } from 'lucide-react';

// Import actual components
import CategoriesLevelsManager from '../../components/settings/CategoriesLevelsManager';
import CpaSettings from '../../components/settings/CpaSettings';
import DailySequenceSettings from '../../components/settings/DailySequenceSettings';
import RankingsSettings from '../../components/settings/RankingsSettings';
import FinancialSettings from '../../components/settings/FinancialSettings';
import InactivityRulesSettings from '../../components/settings/InactivityRulesSettings';
import RewardChestsSettings from '../../components/settings/RewardChestsSettings';
import CommissionSafeSettings from '../../components/settings/CommissionSafeSettings';
import RevenueShareSettings from '../../components/settings/RevenueShareSettings';

const settingsSections = [
  { path: 'categories-levels', label: 'Categorias e Levels', icon: SlidersHorizontal, component: CategoriesLevelsManager },
  { path: 'cpa', label: 'CPA', icon: Users, component: CpaSettings },
  { path: 'daily-sequence', label: 'Sequência Diária', icon: Award, component: DailySequenceSettings },
  { path: 'rankings', label: 'Rankings', icon: TrendingUp, component: RankingsSettings },
  { path: 'financial', label: 'Financeiro Global', icon: Banknote, component: FinancialSettings },
  { path: 'revenue-share', label: 'Revenue Share', icon: DollarSign, component: RevenueShareSettings },
  { path: 'inactivity-rules', label: 'Regras de Inatividade', icon: UserCog, component: InactivityRulesSettings },
  { path: 'reward-chests', label: 'Baús de Recompensa', icon: Box, component: RewardChestsSettings },
  { path: 'commission-safe', label: 'Cofre de Comissões', icon: ShieldCheck, component: CommissionSafeSettings },
];

const SettingsPage: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      <h1 className="text-2xl font-bold text-branco mb-6 font-sora">Gerenciamento de Configurações do Sistema</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <nav className="md:w-1/4 lg:w-1/5 space-y-1 bg-cinza-escuro p-4 rounded-lg shadow-md self-start">
          {settingsSections.map(section => (
            <Link
              key={section.path}
              to={`/settings/${section.path}`}
              className={`flex items-center px-3 py-2.5 text-sm rounded-md w-full text-left 
                ${location.pathname.includes(section.path)
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
            <Route path="/" element={<Navigate to="categories-levels" replace />} />
            <Route path="categories-levels" element={<CategoriesLevelsManager />} />
            <Route path="cpa" element={<CpaSettings />} />
            <Route path="daily-sequence" element={<DailySequenceSettings />} />
            <Route path="rankings" element={<RankingsSettings />} />
            <Route path="financial" element={<FinancialSettings />} />
            <Route path="revenue-share" element={<RevenueShareSettings />} />
            <Route path="inactivity-rules" element={<InactivityRulesSettings />} />
            <Route path="reward-chests" element={<RewardChestsSettings />} />
            <Route path="commission-safe" element={<CommissionSafeSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

