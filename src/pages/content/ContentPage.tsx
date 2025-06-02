import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { FolderKanban, Mail } from 'lucide-react';

// Import components
import ContentManagement from '../../components/content/ContentManagement';
import NotificationTemplatesSettings from '../../components/settings/NotificationTemplatesSettings';

const ContentPage: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      path: '/content/management',
      icon: <FolderKanban className="w-4 h-4" />,
      label: 'Conteúdo',
      component: ContentManagement
    },
    {
      path: '/content/notifications',
      icon: <Mail className="w-4 h-4" />,
      label: 'Notificações',
      component: NotificationTemplatesSettings
    }
  ];

  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath.includes(path);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Marketing</h1>
          <p className="text-gray-600">Gerencie conteúdo e templates de notificação</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                isActive(item.path)
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        <Routes>
          <Route path="/" element={<Navigate to="/content/management" replace />} />
          <Route path="/management" element={<ContentManagement />} />
          <Route path="/notifications" element={<NotificationTemplatesSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default ContentPage;

