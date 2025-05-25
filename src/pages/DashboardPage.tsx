import React from 'react';
import DailyPerformanceChart from '../components/DailyPerformanceChart';
import AffiliateOverviewCard from '../components/AffiliateOverviewCard'; // Import the new card

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Gráfico no topo */}
      <div>
        {/* O título do gráfico já está dentro do componente DailyPerformanceChart, então não é necessário aqui */}
        <DailyPerformanceChart />
      </div>

      {/* Visão Geral de Afiliados Registrados com o novo card único */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold text-branco font-sora">Visão Geral de Afiliados Registrados</h2>
        <AffiliateOverviewCard /> {/* Use the new single card component */}
      </div>

      {/* Seção Afiliados por Nível REMOVIDA conforme solicitado implicitamente pela nova estrutura de Visão Geral */}
      {/* Seção Afiliados por Categoria REMOVIDA conforme solicitado implicitamente pela nova estrutura de Visão Geral e filtros no card */}

    </div>
  );
};

export default DashboardPage;

