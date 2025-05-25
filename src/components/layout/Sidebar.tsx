import React from 'react';
import { LayoutDashboard, Users, UserSquare, Settings, DollarSign, FolderKanban } from 'lucide-react'; // Added FolderKanban icon

const Sidebar: React.FC = () => {
  // TODO: Implement hamburger toggle functionality if needed for mobile/collapsed state
  // TODO: Implement active link highlighting based on current route
  // For active link, you might want to use NavLink from react-router-dom and pass an isActive prop

  const menuItems = [
    {
      href: '/#/dashboard',
      icon: <LayoutDashboard className="w-5 h-5 mr-3" />,
      label: 'Dashboard',
      activeColor: 'text-azul-ciano',
    },
    {
      href: '/#/users',
      icon: <Users className="w-5 h-5 mr-3 text-azul-ciano" />,
      label: 'Gerenciar Usuários',
      activeColor: 'text-branco', // Default color, assuming Dashboard is active by default
    },
    {
      href: '/#/affiliates',
      icon: <UserSquare className="w-5 h-5 mr-3 text-azul-ciano" />,
      label: 'Gerenciar Afiliados',
      activeColor: 'text-branco',
    },
    {
      href: '/#/settings',
      icon: <Settings className="w-5 h-5 mr-3 text-azul-ciano" />,
      label: 'Gerenciar Configurações',
      activeColor: 'text-branco',
    },
    {
      href: '/#/financial',
      icon: <DollarSign className="w-5 h-5 mr-3 text-azul-ciano" />,
      label: 'Gerenciamento Financeiro',
      activeColor: 'text-branco',
    },
    {
      href: '/#/content',
      icon: <FolderKanban className="w-5 h-5 mr-3 text-azul-ciano" />,
      label: 'Gerenciamento de Conteúdo',
      activeColor: 'text-branco',
    },
  ];

  // This is a simple way to highlight, ideally use NavLink from react-router-dom
  const currentPath = window.location.hash;

  return (
    <aside className="fixed top-16 left-0 z-40 w-64 h-full bg-cinza-claro text-branco font-inter shadow-md">
      <div className="p-4">
        <nav>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="mt-2">
                <a
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-cinza-escuro ${currentPath === item.href.substring(1) ? 'bg-cinza-medio text-azul-ciano font-semibold' : item.activeColor}`}
                >
                  {React.cloneElement(item.icon, { className: `w-5 h-5 mr-3 ${currentPath === item.href.substring(1) ? 'text-azul-ciano' : 'text-azul-ciano'}` })}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

