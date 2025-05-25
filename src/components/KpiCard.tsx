import React from 'react';

interface KpiDetail {
  label: string;
  value: string | number;
}

interface KpiCardProps {
  title: string;
  details: KpiDetail[]; // Changed from quantity/commissions to a details array
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  details
}) => {
  return (
    <div className="p-6 rounded-lg shadow-md bg-cinza-claro min-h-[160px] flex flex-col justify-between">
      <h3 className="mb-3 text-lg font-semibold text-branco font-sora">{title}</h3>
      <div className="space-y-2">
        {details.map((detail, index) => (
          <div key={index} className="flex items-baseline justify-between">
            <p className="text-sm text-gray-400 font-inter whitespace-nowrap">{detail.label}:</p>
            <p className="ml-2 text-xl font-bold text-azul-ciano font-sora text-right truncate">{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KpiCard;

