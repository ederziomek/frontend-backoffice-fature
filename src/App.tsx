import { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import UserListPage from './pages/users/UserListPage';
import UserFormPage from './pages/users/UserFormPage';
import AffiliateListPage from './pages/affiliates/AffiliateListPage';
import AffiliateDetailPage from './pages/affiliates/AffiliateDetailPage';
import AffiliateFormPage from './pages/affiliates/AffiliateFormPage';
import SettingsPage from './pages/settings/SettingsPage'; // Main page for all settings
import FinancialPage from './pages/financial/FinancialPage'; // Main page for financial module
import ContentPage from './pages/content/ContentPage'; // Import the new ContentPage
import UserLogsPage from './pages/users/UserLogsPage'; // Import the UserLogsPage
import SecurityPage from './pages/security/SecurityPage'; // Import the SecurityPage

function App() {
  // Estado para controlar a visibilidade do sidebar em dispositivos móveis
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Função para alternar a visibilidade do sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Função para fechar o sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-cinza-escuro text-branco">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex flex-1 pt-16"> {/* Adjust pt-16 based on actual Header height */}
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <main className="main-content flex-1 p-6 transition-all duration-300">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/users" element={<UserListPage />} />
              <Route path="/users/new" element={<UserFormPage />} />
              <Route path="/users/edit/:userId" element={<UserFormPage />} />
              <Route path="/users/logs" element={<UserLogsPage />} />
              <Route path="/affiliates" element={<AffiliateListPage />} />
              <Route path="/affiliates/new" element={<AffiliateFormPage />} />
              <Route path="/affiliates/edit/:affiliateId" element={<AffiliateFormPage />} />
              <Route path="/affiliates/detail/:affiliateId" element={<AffiliateDetailPage />} />
              <Route path="/settings/*" element={<SettingsPage />} /> {/* Catch-all for settings sub-routes */}
              <Route path="/financial/*" element={<FinancialPage />} /> {/* Catch-all for financial sub-routes */}
              <Route path="/security/*" element={<SecurityPage />} /> {/* Catch-all for security sub-routes */}
              <Route path="/content" element={<ContentPage />} /> {/* Add route for Content Management */}
              {/* Add other routes here as needed */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
