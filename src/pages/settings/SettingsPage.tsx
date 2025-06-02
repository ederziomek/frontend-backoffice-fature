import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { SlidersHorizontal, Users, TrendingUp, Award, ShieldCheck, Box, Banknote, UserCog, DollarSign, Mail } from 'lucide-react';

// Import actual components
import AffiliateCategoriesLevelsSettings from '../../components/settings/AffiliateCategoriesLevelsSettings';
import CpaSettings from '../../components/settings/CpaSettings';
import DailySequenceSettings from '../../components/settings/DailySequenceSettings';
import RankingsSettings from '../../components/settings/RankingsSettings';
import FinancialSettings from '../../components/settings/FinancialSettings';
import InactivityRulesSettings from '../../components/settings/InactivityRulesSettings';
import RewardChestsSettings from '../../components/settings/RewardChestsSettings';
import CommissionSafeSettings from '../../components/settings/CommissionSafeSettings';
import RevenueShareSettings from '../../components/settings/RevenueShareSettings';
import NotificationTemplatesSettings from '../../components/settings/NotificationTemplatesSettings';

const settingsSections = [
  { path: 'categories-levels', label: 'Categorias e Levels', icon: SlidersHorizontal, component: AffiliateCategoriesLevelsSettings },
  { path: 'cpa', label: 'CPA', icon: Users, component: CpaSettings },
  { path: 'daily-sequence', label: 'Sequência Diária', icon: Award, component: DailySequenceSettings },
  { path: 'rankings', label: 'Rankings', icon: TrendingUp, component: RankingsSettings },
  { path: 'financial', label: 'Financeiro Global', icon: Banknote, component: FinancialSettings },
  { path: 'revenue-share', label: 'Revenue Share', icon: DollarSign, component: RevenueShareSettings },
  { path: 'inactivity-rules', label: 'Regras de Inatividade', icon: UserCog, component: InactivityRulesSettings },
  { path: 'notification-templates', label: 'Templates de Notificação', icon: Mail, component: NotificationTemplatesSettings },
  { path: 'reward-chests', label: 'Baús de Recompensa', icon: Box, component: RewardChestsSettings },
  { path: 'commission-safe', label: 'Cofre de Comissões', icon: ShieldCheck, component: CommissionSafeSettings },
];

const SettingsPage: React.FC = () => {
  const location = useLocation();
  // A rota base para esta página é /settings/
  // Os links para os submenus devem ser relativos a esta página, mas como estamos dentro de um <Routes> aninhado,
  // usar apenas section.path fará com que o react-router tente resolver a partir da URL atual.
  // Para garantir que os links funcionem corretamente a partir da base /settings/ e não acumulem paths,
  // vamos construir o path completo para o Link.
  // No entanto, a configuração de <Route path={section.path} ... /> dentro deste componente já espera caminhos relativos
  // à rota pai que renderiza SettingsPage (que é /settings/*).
  // O problema identificado pela URL .../#/settings/categories-levels/cpa/categories-levels/rankings
  // sugere que o Link to={section.path} está sendo interpretado como relativo ao último segmento da URL, e não à base /settings.

  // Correção: Os Links devem apontar para o caminho completo a partir da raiz da aplicação se o roteamento aninhado não estiver
  // configurado para lidar com caminhos relativos de forma inteligente, ou garantir que os caminhos sejam relativos ao contexto correto.
  // Dado que App.tsx tem <Route path="/settings/*" element={<SettingsPage />} />,
  // dentro de SettingsPage, <Link to="cpa"> deveria levar para /settings/cpa.
  // E <Route path="cpa"> deveria renderizar o componente quando a URL for /settings/cpa.
  // A estrutura atual parece correta para o React Router v6.
  // O problema de acúmulo de URL (ex: /settings/categories-levels/cpa) acontece se o Link to="cpa" for clicado quando a URL já é /settings/categories-levels.
  // Isso significa que o `to` está sendo tratado como relativo ao último path. 
  // Para corrigir, os links devem ser relativos à rota pai que renderiza SettingsPage, ou seja, `/settings/`.
  // No React Router v6, se SettingsPage é renderizado por uma rota como `/settings/*`,
  // um `<Link to="subpath">` dentro de SettingsPage deve resolver para `/settings/subpath`.
  // Se isso não está acontecendo, pode ser um comportamento inesperado ou uma má interpretação.
  // A URL fornecida pelo usuário: .../#/settings/categories-levels/cpa/categories-levels/rankings
  // Isso é muito estranho. `categories-levels` aparece duas vezes.
  // Vamos garantir que os links sejam construídos a partir da base `/settings/` para evitar qualquer ambiguidade.

  return (
    <div>
      <h1 className="text-2xl font-bold text-branco mb-6 font-sora">Gerenciamento de Configurações do Sistema</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <nav className="md:w-1/4 lg:w-1/5 space-y-1 bg-cinza-escuro p-4 rounded-lg shadow-md self-start">
          {settingsSections.map(section => (
            <Link
              key={section.path}
              // Correção: Usar path absoluto a partir de /settings/
              // Ou garantir que o path relativo seja resolvido corretamente.
              // O problema é que `to={section.path}` sem uma barra inicial é relativo ao path atual.
              // Se estamos em /settings/categories-levels e clicamos em um link com to="cpa", ele vai para /settings/categories-levels/cpa.
              // Precisamos que ele vá para /settings/cpa.
              // A forma mais simples é garantir que o path no Link seja relativo à rota que renderiza SettingsPage.
              // Como SettingsPage é montado em "/settings/*", os links internos devem ser apenas "subpath".
              // A URL do usuário mostra que o problema é mais complexo, com duplicação de paths.
              // Vamos tentar forçar o path a ser relativo ao pai, o que o React Router v6 deveria fazer por padrão.
              // Se `location.pathname` é `/settings/foo/bar` e `section.path` é `baz`, `to={section.path}` deveria ir para `/settings/foo/baz`.
              // O que queremos é `/settings/baz`.
              // A maneira correta de lidar com rotas aninhadas é usar `Outlet` e definir as rotas filhas no componente pai.
              // Aqui, `SettingsPage` já é o componente para `/settings/*` e ele mesmo define as sub-rotas.
              // O <Link to={section.path}> deveria funcionar corretamente, levando para /settings/{section.path}.
              // A URL do usuário (`.../#/settings/categories-levels/cpa/categories-levels/rankings`) é o sintoma.
              // O problema está em como `section.path` está sendo usado no `Link` quando a URL já tem subníveis.
              // Se `location.pathname` é `/settings/categories-levels` e `section.path` é `cpa`, `to={section.path}` (ou `to="cpa"`) deve levar a `/settings/cpa`.
              // Se está levando a `/settings/categories-levels/cpa`, então o `Link` está resolvendo o path de forma incorreta ou o estado da URL está sendo mal gerenciado.
              // A correção mais robusta é usar caminhos absolutos para os links dos submenus para evitar que o router os aninhe incorretamente.
              to={`/settings/${section.path}`} 
              className={`flex items-center px-3 py-2.5 text-sm rounded-md w-full text-left 
                ${location.pathname.endsWith(section.path) // Esta lógica de highlight pode precisar de ajuste com paths absolutos
                  ? 'bg-azul-ciano text-branco font-semibold shadow-lg' 
                  : 'text-gray-300 hover:bg-cinza-claro hover:text-branco'}`}
            >
              <section.icon size={18} className="mr-3 flex-shrink-0" />
              {section.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1">
          {/* As rotas aqui são relativas ao path que renderizou SettingsPage, ou seja, "/settings/" */}
          {/* Então <Route path="categories-levels" /> corresponde a "/settings/categories-levels" */}
          <Routes>
            {/* Redireciona da rota base /settings/ para o primeiro submenu */}
            <Route path="/" element={<Navigate to={`/settings/${settingsSections[0].path}`} replace />} /> 
            {settingsSections.map(section => (
              <Route key={section.path} path={section.path} element={<section.component />} />
            ))}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

