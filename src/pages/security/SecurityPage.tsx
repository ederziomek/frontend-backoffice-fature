import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Shield, Activity, AlertTriangle, Users, Eye } from 'lucide-react';

// Import security components
import AuditLogsPage from './AuditLogsPage';
import SuspiciousAffiliatesPage from './SuspiciousAffiliatesPage';
import FraudDetectionPage from './FraudDetectionPage';
import SecurityAlertsPage from './SecurityAlertsPage';
import NetworkAnalysisPage from './NetworkAnalysisPage';

const securitySections = [
  { path: 'audit-logs', label: 'Auditoria e Logs', icon: Activity, component: AuditLogsPage },
  { path: 'suspicious-affiliates', label: 'Afiliados Suspeitos', icon: AlertTriangle, component: SuspiciousAffiliatesPage },
  { path: 'fraud-detection', label: 'Detecção de Fraudes', icon: Shield, component: FraudDetectionPage },
  { path: 'network-analysis', label: 'Análise de Rede', icon: Users, component: NetworkAnalysisPage },
  { path: 'security-alerts', label: 'Alertas de Segurança', icon: Eye, component: SecurityAlertsPage },
];

const SecurityPage: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      <h1 className="text-2xl font-bold text-branco mb-6 font-sora">Central de Segurança</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <nav className="md:w-1/4 lg:w-1/5 space-y-1 bg-cinza-escuro p-4 rounded-lg shadow-md self-start">
          {securitySections.map(section => (
            <Link
              key={section.path}
              to={`/security/${section.path}`}
              className={`flex items-center px-3 py-2.5 text-sm rounded-md w-full text-left 
                ${location.pathname === `/security/${section.path}`
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
            <Route path="/" element={<Navigate to={`/security/${securitySections[0].path}`} replace />} />
            {securitySections.map(section => (
              <Route key={section.path} path={section.path} element={<section.component />} />
            ))}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;

